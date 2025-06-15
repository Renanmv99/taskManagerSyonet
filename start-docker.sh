echo "Iniciando backend"

cd backend || { echo "❌ Falha ao entrar na pasta backend"; exit 1; }

echo "Instalando dependências"
./mvnw clean install package -DskipTests || { echo "❌ Erro ao buildar o backend"; exit 1; }
cd ..

echo "Iniciando frontend" 
cd frontend || { echo "❌ Falha ao entrar na pasta frontend"; exit 1; }

echo "Instalando dependências"
npm install || { echo "❌ Erro ao rodar npm install"; exit 1; }

echo "Buildando o projeto"
npm run build || { echo "❌ Erro ao rodar npm run build"; exit 1; }
cd ..

echo "Verificando se a porta 5432 está livre..."

if lsof -i :5432 >/dev/null; then
  echo "Porta 5432 já está em uso!"
  exit 1
else
  docker compose up -d --build || { echo "❌ Erro ao subir o Docker"; exit 1; }
fi