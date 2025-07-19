@echo off
echo Limpando cache do Vite...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "dist" rmdir /s /q "dist"
echo Cache limpo!
echo Iniciando servidor...
npm run dev 