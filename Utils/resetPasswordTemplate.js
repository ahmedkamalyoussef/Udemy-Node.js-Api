exports.resetPasswordTemplate = (resetCode) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h2 {
      color: #333;
    }
    p {
      font-size: 16px;
      color: #555;
    }
    .code {
      display: inline-block;
      background: #007bff;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>You're receiving this email because a password reset request was made for your account.</p>
    <p>Use the following reset code to proceed:</p>
    <div class="code">${resetCode}</div>
    <p>If you did not request this, please ignore this email.</p>
    <p class="footer">Thank you,<br> Sanad Team</p>
  </div>
</body>
</html>
`;
