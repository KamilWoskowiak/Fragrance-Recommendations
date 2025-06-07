@echo off
setlocal EnableDelayedExpansion

set "REPO=KamilWoskowiak/Fragrance-Recommendations"

echo.
echo Fetching deployments for %REPO% …
echo (this may take a few seconds)
echo.

for /f "usebackq delims=" %%D in (`
    gh api --paginate -q ".[].id" ^
        "/repos/%REPO%/deployments"
`) do (
    echo ------------------------------------------------------------------
    echo  Deployment %%D

    gh api --method POST ^
        "/repos/%REPO%/deployments/%%D/statuses" ^
        -f state=inactive

    gh api --method DELETE ^
        "/repos/%REPO%/deployments/%%D"
)

echo.
echo All done!
pause
endlocal
