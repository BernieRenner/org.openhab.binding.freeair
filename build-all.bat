@echo off
REM Build FreeAir binding for all supported openHAB versions
echo Building FreeAir binding for all openHAB versions...
echo.

REM Create dist folder for final JARs
if not exist dist mkdir dist

echo [1/2] Building for openHAB 5.0.x...
call mvn -Poh50 clean package -q
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build for openHAB 5.0.x failed!
    exit /b 1
)
copy /Y target\org.openhab.binding.freeair-5.0.0.jar dist\ >nul
echo       Done: dist\org.openhab.binding.freeair-5.0.0.jar

echo [2/2] Building for openHAB 5.1.x...
call mvn clean package -q
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build for openHAB 5.1.x failed!
    exit /b 1
)
copy /Y target\org.openhab.binding.freeair-5.1.0.jar dist\ >nul
echo       Done: dist\org.openhab.binding.freeair-5.1.0.jar

echo.
echo Build complete! JARs are in the dist\ folder:
dir /B dist\*.jar
