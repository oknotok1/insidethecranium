import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      { error: "Authorization failed", details: error },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 },
    );
  }

  // Return HTML page that automatically exchanges the token
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Spotify Authorization</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #121212;
            color: #fff;
          }
          .code {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            word-break: break-all;
            border: 1px solid #333;
          }
          .spinner {
            border: 3px solid #333;
            border-top: 3px solid #1db954;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          button {
            background: #1db954;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            margin: 10px 10px 10px 0;
          }
          button:hover {
            background: #1ed760;
          }
          .success {
            color: #1db954;
          }
          .error {
            color: #ff4444;
          }
          h1 {
            color: #1db954;
          }
          #loading {
            display: block;
          }
          #result {
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="loading">
          <h1>🔄 Exchanging Token...</h1>
          <div class="spinner"></div>
          <p>Please wait while we get your refresh token...</p>
        </div>
        
        <div id="result">
          <h1 id="resultTitle"></h1>
          <div id="resultContent"></div>
        </div>
        
        <script>
          const code = "${code}";
          
          async function exchangeToken() {
            try {
              const response = await fetch('/api/exchange-token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
              });
              
              const data = await response.json();
              
              document.getElementById('loading').style.display = 'none';
              document.getElementById('result').style.display = 'block';
              
              if (data.success) {
                document.getElementById('resultTitle').textContent = '✅ Success!';
                document.getElementById('resultTitle').className = 'success';
                document.getElementById('resultContent').innerHTML = \`
                  <p>Your new refresh token:</p>
                  <div class="code" id="refreshToken">\${data.refresh_token}</div>
                  <button onclick="copyToken()">Copy Refresh Token</button>
                  
                  <h2>Next Steps:</h2>
                  <ol>
                    <li>Copy the refresh token above</li>
                    <li>Open your <code>.env.local</code> file</li>
                    <li>Replace the <code>SPOTIFY_REFRESH_TOKEN</code> value with the new token</li>
                    <li>Restart your dev server (yarn dev)</li>
                  </ol>
                  
                  <p style="margin-top: 30px; padding: 15px; background: #1e1e1e; border-radius: 8px; border: 1px solid #333;">
                    <strong>Example:</strong><br>
                    <code>SPOTIFY_REFRESH_TOKEN=\${data.refresh_token}</code>
                  </p>
                \`;
                
                window.refreshToken = data.refresh_token;
              } else {
                document.getElementById('resultTitle').textContent = '❌ Error';
                document.getElementById('resultTitle').className = 'error';
                document.getElementById('resultContent').innerHTML = \`
                  <p>Failed to exchange token:</p>
                  <div class="code">\${JSON.stringify(data, null, 2)}</div>
                \`;
              }
            } catch (err) {
              document.getElementById('loading').style.display = 'none';
              document.getElementById('result').style.display = 'block';
              document.getElementById('resultTitle').textContent = '❌ Error';
              document.getElementById('resultTitle').className = 'error';
              document.getElementById('resultContent').innerHTML = \`
                <p>An error occurred:</p>
                <div class="code">\${err.message}</div>
              \`;
            }
          }
          
          function copyToken() {
            navigator.clipboard.writeText(window.refreshToken);
            alert('Refresh token copied to clipboard!');
          }
          
          // Automatically exchange token on page load
          exchangeToken();
        </script>
      </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
}
