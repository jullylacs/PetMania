@echo off
echo Iniciando o sistema PetMania...

:: Verificar se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js nao encontrado! Por favor, instale o Node.js primeiro.
    pause
    exit /b
)

:: Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)

:: Iniciar o servidor
echo Iniciando o servidor...
npm start

pause