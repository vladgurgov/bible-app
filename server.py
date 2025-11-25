#!/usr/bin/env python3
"""
Simple HTTP server for the Bible Study SPA.
Serves index.html for all routes to enable client-side routing.
"""

import http.server
import socketserver
import os
from urllib.parse import unquote

PORT = 8000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom handler that serves index.html for all non-file requests.
    This enables client-side routing for the Single Page Application.
    """
    
    def do_GET(self):
        # Decode the URL path
        path = unquote(self.path)
        
        # Remove query string and fragment
        if '?' in path:
            path = path.split('?')[0]
        if '#' in path:
            path = path.split('#')[0]
        
        # Check if the requested path is a file that exists
        # (for CSS, JS, JSON, images, etc.)
        file_path = path.lstrip('/')
        if file_path and os.path.isfile(file_path):
            # Serve the actual file
            return super().do_GET()
        
        # For all other paths (routes), serve index.html
        self.path = '/index.html'
        return super().do_GET()

def main():
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"🌐 Server running at http://localhost:{PORT}/")
        print("📖 Bible Study application is ready!")
        print("Press Ctrl+C to stop the server\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✅ Server stopped.")

if __name__ == "__main__":
    main()

