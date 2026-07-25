// ThesisFrame Windows Launcher
// Double-click to run - no terminal window, opens browser automatically
// Cross-compiled from Linux with: GOOS=windows GOARCH=amd64 go build
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"
	"time"
)

const (
	appTitle   = "ThesisFrame"
	appVersion = "0.2.0"
	port       = "3100"
	maxWaitSec = 90
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
	// Check if Node.js exists
	if _, err := os.Stat(nodeExe); os.IsNotExist(err) {
		showError(fmt.Sprintf("Cannot find Node.js at:\n%s\n\nPlease extract the ZIP completely before running.", nodeExe))
		return
	}

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
		showError(fmt.Sprintf("Failed to start ThesisFrame:\n%s\n\nCheck server.log for details.", err))
		return
	}

	// Wait for server to be ready
	if !waitForServer(maxWaitSec) {
		stopServer()
		logContent := readLog()
		errorMsg := "Server did not start in time."
		if logContent != "" {
			lines := strings.Split(logContent, "\n")
			errorLines := []string{}
			for i := len(lines) - 1; i >= 0 && len(errorLines) < 5; i-- {
				if strings.Contains(lines[i], "ERROR") || strings.Contains(lines[i], "Fatal") {
					errorLines = append(errorLines, lines[i])
				}
			}
			if len(errorLines) > 0 {
				errorMsg += "\n\nserver.log errors:\n" + strings.Join(errorLines, "\n")
			}
		}
		showError(errorMsg)
		return
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

	startJS := filepath.Join(appDir, "start.js")
	if _, err := os.Stat(startJS); err == nil {
		serverCmd = exec.Command(nodeExe, startJS)
	} else {
		serverCmd = exec.Command(nodeExe, "server.js")
	}
	serverCmd.Dir = appDir
	serverCmd.Env = env
	serverCmd.Stdin = nil
	serverCmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: 0x08000000,
	}
	return serverCmd.Start()
}

func waitForServer(timeoutSec int) bool {
	client := &http.Client{Timeout: 3 * time.Second}
	deadline := time.Now().Add(time.Duration(timeoutSec) * time.Second)
	for time.Now().Before(deadline) {
		resp, err := client.Get(serverURL)
		if err == nil {
			body, _ := ioutil.ReadAll(resp.Body)
			resp.Body.Close()
			if resp.StatusCode == 200 && len(body) > 500 && strings.Contains(string(body), "<html") {
				return true
			}
		}
		time.Sleep(1 * time.Second)
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
	default:
		cmd = exec.Command("xdg-open", url)
	}
	cmd.Start()
}

func readLog() string {
	data, err := ioutil.ReadFile(filepath.Join(appDir, "server.log"))
	if err != nil {
		return ""
	}
	return string(data)
}

func showError(msg string) {
	// Write error to temp file and show via PowerShell dialog
	tmpFile := filepath.Join(os.TempDir(), "tf_err.txt")
	ioutil.WriteFile(tmpFile, []byte(msg), 0644)
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		psScript := fmt.Sprintf(`Add-Type -AssemblyName System.Windows.Forms; $f=[System.IO.File]::ReadAllText('%s'); [System.Windows.Forms.MessageBox]::Show($f, 'ThesisFrame', 'OK', 'Error')`, tmpFile)
		cmd = exec.Command("powershell.exe", "-NoProfile", "-Command", psScript)
	default:
		fmt.Fprintln(os.Stderr, msg)
		return
	}
	cmd.Run()
}
