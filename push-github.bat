@echo off
chcp 65001 >nul
echo ========================================
echo   Enviar projeto para o GitHub
echo   Repositorio: zilmer-site1
echo ========================================
echo.

cd /d "%~dp0"

set /p GITHUB_USER="Digite seu usuario do GitHub (ex: rocco.digiulio): "

if "%GITHUB_USER%"=="" (
    echo ERRO: Usuario nao pode ser vazio.
    pause
    exit /b 1
)

echo.
echo Removendo remote antigo (se existir)...
git remote remove origin 2>nul

echo Adicionando remote: https://github.com/%GITHUB_USER%/zilmer-site1.git
git remote add origin https://github.com/%GITHUB_USER%/zilmer-site1.git

if errorlevel 1 (
    echo ERRO ao adicionar remote.
    pause
    exit /b 1
)

echo.
echo Enviando para o GitHub (branch main)...
git push -u origin main

if errorlevel 1 (
    echo.
    echo Se pedir senha, use um Personal Access Token em vez da senha.
    echo Criar token: GitHub - Settings - Developer settings - Personal access tokens
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Concluido! Acesse:
echo   https://github.com/%GITHUB_USER%/zilmer-site1
echo ========================================
pause
