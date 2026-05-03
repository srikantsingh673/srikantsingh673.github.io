#!/usr/bin/env python3
"""Simple local dev server — run: python3 serve.py"""
import http.server, socketserver, os

PORT = 3000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()
    def log_message(self, fmt, *args):
        print(f"  {args[0]} {args[1]}")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"\n  Site running at http://localhost:{PORT}\n")
    httpd.serve_forever()
