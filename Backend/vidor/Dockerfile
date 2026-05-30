# ========================================
# Stage 1: Build the Maven application
# ========================================
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ========================================
# Stage 2: Create runtime container
# ========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from Stage 1
COPY --from=build /app/target/vidor-0.0.1-SNAPSHOT.jar app.jar

# Expose server port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
