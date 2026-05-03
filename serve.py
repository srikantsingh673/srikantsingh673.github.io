#!/usr/bin/env python3
"""Simple local dev server with auto-reload — run: python3 serve.py"""

import http.server
import socketserver
import os
import time
import threading

PORT = 3000
WATCH_INTERVAL = 1  # seconds

os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        print(f"  {args[0]} {args[1]}")


# ✅ Reusable server (fixes Address already in use)
class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def get_files_mtime():
    mtimes = {}
    for root, _, files in os.walk("."):
        for f in files:
            path = os.path.join(root, f)
            try:
                mtimes[path] = os.path.getmtime(path)
            except FileNotFoundError:
                pass
    return mtimes


def watch_for_changes(stop_callback):
    last_mtimes = get_files_mtime()

    while True:
        time.sleep(WATCH_INTERVAL)
        current_mtimes = get_files_mtime()

        if current_mtimes != last_mtimes:
            print("\n🔄 Changes detected. Reloading server...\n")
            stop_callback()
            break


def run_server():
    with ReusableTCPServer(("", PORT), Handler) as httpd:
        print(f"\n  🚀 Site running at http://localhost:{PORT}\n")

        def stop_server():
            httpd.shutdown()

        watcher = threading.Thread(
            target=watch_for_changes,
            args=(stop_server,),
            daemon=True
        )
        watcher.start()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user (Ctrl+C)")
        finally:
            httpd.server_close()  # ensure port release


if __name__ == "__main__":
    try:
        while True:
            run_server()
            time.sleep(1)  # give OS time to free port
            print("♻️ Restarting...\n")
    except KeyboardInterrupt:
        print("\n👋 Exiting...")