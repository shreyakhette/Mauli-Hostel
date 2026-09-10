# Stage 1: Build Java 21 Spring Boot Application
FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Build application artifact (skipping tests for fast container builds)
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production JRE Runtime (Secure, Minimal Non-Root Container)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create unprivileged service user for security
RUN addgroup -S sakhigroup && adduser -S sakhiuser -G sakhigroup

# Copy built executable jar from builder stage
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R sakhiuser:sakhigroup /app

USER sakhiuser

# Default production runtime variables (overridden by Render environment)
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=postgres \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT}"]
