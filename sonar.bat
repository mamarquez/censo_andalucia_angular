@echo off
set SONAR_TOKEN=sqa_c76e399bf979b380c8510cbf4e031c3d11897983

echo Generando cobertura...
call ng test --watch=false --coverage --coverage-reporters=lcov

echo Normalizando rutas de lcov.info...
powershell -NoProfile -Command "(Get-Content 'coverage/censo_andalucia_angular/lcov.info') -replace '\\', '/' | Set-Content 'coverage/censo_andalucia_angular/lcov.info'"

echo Enviando a SonarQube...
call npx sonar-scanner -Dsonar.token=%SONAR_TOKEN%

pause