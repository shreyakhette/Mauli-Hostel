package com.sakhi.hostel.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Smart Database Configuration for PostgreSQL cloud deployment (e.g. Render, Railway, Heroku).
 * Automatically detects and adapts standard cloud 'DATABASE_URL' environment variables
 * (postgresql://user:pass@host:port/dbname) into Spring JDBC format.
 */
@Configuration
@Profile("postgres")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            log.info("Detected cloud DATABASE_URL. Adapting to PostgreSQL JDBC DataSource...");
            try {
                String cleanUrl = databaseUrl.trim();
                if (cleanUrl.startsWith("jdbc:")) {
                    cleanUrl = cleanUrl.substring(5);
                }

                // Handle postgres:// prefix by standardizing scheme for URI parser
                if (cleanUrl.startsWith("postgres://")) {
                    cleanUrl = "postgresql://" + cleanUrl.substring("postgres://".length());
                }

                URI uri = new URI(cleanUrl);

                String username = properties.getUsername();
                String password = properties.getPassword();

                String userInfo = uri.getUserInfo();
                if (userInfo != null && !userInfo.isEmpty()) {
                    if (userInfo.contains(":")) {
                        String[] credentials = userInfo.split(":", 2);
                        username = credentials[0];
                        password = credentials[1];
                    } else {
                        username = userInfo;
                    }
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String query = uri.getQuery();

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                if (query != null && !query.trim().isEmpty()) {
                    jdbcUrl += "?" + query;
                }

                log.info("Successfully adapted cloud DATABASE_URL for host: {} and database: {}", host, path);

                HikariConfig hikariConfig = new HikariConfig();
                hikariConfig.setDriverClassName("org.postgresql.Driver");
                hikariConfig.setJdbcUrl(jdbcUrl);
                hikariConfig.setUsername(username);
                hikariConfig.setPassword(password);

                hikariConfig.setMaximumPoolSize(10);
                hikariConfig.setMinimumIdle(2);
                hikariConfig.setIdleTimeout(600000);
                hikariConfig.setConnectionTimeout(30000);
                hikariConfig.setMaxLifetime(1800000);

                return new HikariDataSource(hikariConfig);
            } catch (URISyntaxException | RuntimeException e) {
                log.error("Failed to parse DATABASE_URL: {}. Falling back to default datasource properties.", e.getMessage());
            }
        }

        log.info("No cloud DATABASE_URL override found. Using standard properties datasource.");
        return properties.initializeDataSourceBuilder().build();
    }
}
