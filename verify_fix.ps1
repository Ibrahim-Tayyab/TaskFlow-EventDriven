$baseUrl = "http://localhost:8000"
$futureDate = (Get-Date).AddMinutes(5).ToString("yyyy-MM-ddTHH:mm:00")
$baseUrl = "http://localhost:8000"
$futureDate = (Get-Date).AddMinutes(5).ToString("yyyy-MM-ddTHH:mm:00")
$rnd = Get-Random
$email = "verify_user_$rnd@example.com"
$password = "password123"
$signupBody = @{ email=$email; password=$password; name="Test User" } | ConvertTo-Json

Write-Host "Signing up new user $email..."
try {
    $auth = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/auth/signup" -Body $signupBody -ContentType "application/json"
    $token = $auth.token
    Write-Host "Signed up & Logged in. Token: $($token.Substring(0, 10))..."
} catch {
    Write-Host "Signup failed: $_"
    exit
}

$headers = @{ Authorization="Bearer $token"; "Content-Type"="application/json" }
$taskBody = @{
    description = "FUTURE TASK DO NOT NOTIFY"
    due_date = $futureDate
    is_recurring = $false
} | ConvertTo-Json

Write-Host "Creating task due at $futureDate..."
try {
    $task = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/tasks" -Body $taskBody -Headers $headers
    Write-Host "Task Created: $($task.id)"
} catch {
    Write-Host "Error creating task: $_"
    exit
}

Write-Host "Triggering Cron..."
try {
    $cron = Invoke-RestMethod -Method Post -Uri "$baseUrl/api/cron/check-reminders" -ContentType "application/json"
    Write-Host "Cron Response: $($cron | ConvertTo-Json -Depth 5)"
    
    if ($cron.reminders_sent -eq 0) {
        Write-Host "SUCCESS: reminders_sent is 0. Future task was NOT notified."
    } else {
        Write-Host "FAILURE: reminders_sent is $($cron.reminders_sent). Future task WAS notified (or old tasks were found)."
    }
} catch {
    Write-Host "Error triggering cron: $_"
}
