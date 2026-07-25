// ThesisFrame Windows Launcher
// Double-click to run - no terminal window, opens browser automatically
// Cross-compiled from Linux with: GOOS=windows GOARCH=amd64 go build
package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"syscall"
	"time"
)

const (
	appTitle   = "ThesisFrame"
	appVersion = "0.2.0"
	port       = "3100"
	maxWaitSec = 120
)

var (
	serverCmd *exec.Cmd
	appDir    string
	nodeExe   string
	serverURL = "http://127.0.0.1:" + port
)

func init() {
	exePath, _ := os.Executable()
	appDir = filepath.Dir(exePath)
	nodeExe = filepath.Join(appDir, "node", "node.exe")
}

func main() {
	// Check if already running
	if isAlreadyRunning() {
		openBrowser(serverURL)
		return
	}

	// Ensure database directory exists
	dbDir := filepath.Join(appDir, "db")
	os.MkdirAll(dbDir, 0755)

	// Start the server
	if err := startServer(); err != nil {
		showError(fmt.Sprintf("Failed to start ThesisFrame:\n%s", err))
		os.Exit(1)
	}

	// Wait for server to be ready
	if !waitForServer(maxWaitSec) {
		showError("ThesisFrame server did not start in time.\nPlease check server.log for details.")
		stopServer()
		os.Exit(1)
	}

	// Open browser
	openBrowser(serverURL)

	// Keep running until server exits
	serverCmd.Wait()
}

func isAlreadyRunning() bool {
	client := &http.Client{Timeout: 2 * time.Second}
	resp, err := client.Get(serverURL)
	if err == nil {
		resp.Body.Close()
		return true
	}
	return false
}

func startServer() error {
	env := append(os.Environ(),
		"NODE_ENV=production",
		"PORT="+port,
		"DATABASE_URL=file:./db/thesis.db",
		"HOSTNAME=127.0.0.1",
	)

	serverJS := filepath.Join(appDir, "server.js")
	serverCmd = exec.Command(nodeExe, serverJS)
	serverCmd.Dir = appDir
	serverCmd.Env = env
	serverCmd.Stdin = nil

	// Hide console window on Windows - use CREATE_NO_WINDOW flag
	serverCmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: 0x08000000,
	}

	// Log output
	logFile, err := os.OpenFile(filepath.Join(appDir, "server.log"), os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err == nil {
		serverCmd.Stdout = logFile
		serverCmd.Stderr = logFile
	}

	return serverCmd.Start()
}

func waitForServer(timeoutSec int) bool {
	client := &http.Client{Timeout: 2 * time.Second}
	deadline := time.Now().Add(time.Duration(timeoutSec) * time.Second)

	for time.Now().Before(deadline) {
		resp, err := client.Get(serverURL)
		if err == nil {
			resp.Body.Close()
			return true
		}
		time.Sleep(500 * time.Millisecond)
	}
	return false
}

func stopServer() {
	if serverCmd != nil && serverCmd.Process != nil {
		serverCmd.Process.Kill()
	}
}

func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	cmd.Start()
}

func showError(msg string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		// Use PowerShell to show a graphical error dialog
		psCmd := fmt.Sprintf(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('%s', 'ThesisFrame Error', 'OK', 'Error')`, msg)
		cmd = exec.Command("powershell.exe", "-WindowStyle", "Hidden", "-Command", psCmd)
		cmd.Run()
	default:
		fmt.Fprintln(os.Stderr, msg)
	}
}