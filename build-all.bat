@echo off
setlocal enabledelayedexpansion

REM Build FreeAir binding for all supported openHAB versions
REM Usage: build-all.bat [clean]

echo ============================================
echo  FreeAir Binding - Multi-Version Build
echo ============================================
echo.

set ARTIFACT_ID=org.openhab.binding.freeair
set BUILD_FAILED=0

REM Create dist folder for final JARs
if not exist dist mkdir dist

REM Clean dist folder if requested
if "%1"=="clean" (
    echo Cleaning dist folder...
    del /Q dist\*.jar 2>nul
    echo.
)

echo [1/2] Building for openHAB 5.0.x...
call mvn -Poh50 clean package -DskipTests -q
if !ERRORLEVEL! neq 0 (
    echo        ERROR: Build for openHAB 5.0.x failed!
    set BUILD_FAILED=1
    goto :build51
)
REM Find and copy the built JAR (handles version dynamically)
for %%f in (target\%ARTIFACT_ID%-5.0*.jar) do (
    if not "%%~nxf"=="%ARTIFACT_ID%-5.0*" (
        copy /Y "%%f" "dist\%ARTIFACT_ID%-5.0.0.jar" >nul
        echo        Done: dist\%ARTIFACT_ID%-5.0.0.jar
    )
)

:build51
echo [2/2] Building for openHAB 5.1.x...
call mvn clean package -DskipTests -q
if !ERRORLEVEL! neq 0 (
    echo        ERROR: Build for openHAB 5.1.x failed!
    set BUILD_FAILED=1
    goto :summary
)
REM Find and copy the built JAR (handles version dynamically)
for %%f in (target\%ARTIFACT_ID%-5.1*.jar) do (
    if not "%%~nxf"=="%ARTIFACT_ID%-5.1*" (
        copy /Y "%%f" "dist\%ARTIFACT_ID%-5.1.0.jar" >nul
        echo        Done: dist\%ARTIFACT_ID%-5.1.0.jar
    )
)

:summary
echo.
echo ============================================
if !BUILD_FAILED! equ 0 (
    echo  Build complete! JARs in dist\ folder:
    echo ============================================
    dir /B dist\*.jar 2>nul
) else (
    echo  Build completed with errors!
    echo ============================================
)
echo.

endlocal
exit /b %BUILD_FAILED%
