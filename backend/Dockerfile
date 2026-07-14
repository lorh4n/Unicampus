FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
# Copia arquivos do Gradle
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
# Copia código fonte
COPY src src
# Compila e empacota o app
RUN ./gradlew installDist --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copia o build gerado
COPY --from=build /app/build/install/unicampus-backend .

# Variáveis de ambiente padrão
ENV PORT=8080
ENV UNICAMPUS_DATA_DIR=/app/data

EXPOSE 8080
CMD ["bin/unicampus-backend"]
