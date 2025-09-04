const express = require('express');
const router = express.Router();
const os = require('os');

// Basic health check
router.get('/', (req, res) => {
  const healthCheck = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    service: 'weather-dashboard-backend'
  };

  res.json(healthCheck);
});

// Detailed health check with system info
router.get('/detailed', async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Test weather service connectivity
    let weatherServiceStatus = 'unknown';
    let weatherServiceLatency = null;
    
    try {
      const startTime = Date.now();
      const testResponse = await require('axios').get(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.OPENWEATHER_API_KEY || 'test'}`,
        { timeout: 5000 }
      );
      weatherServiceLatency = Date.now() - startTime;
      weatherServiceStatus = testResponse.status === 200 ? 'healthy' : 'degraded';
    } catch (error) {
      weatherServiceStatus = 'unhealthy';
      weatherServiceLatency = null;
    }

    const detailedHealth = {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: {
        name: 'weather-dashboard-backend',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: {
          process: process.uptime(),
          system: os.uptime()
        }
      },
      system: {
        platform: os.platform(),
        architecture: os.arch(),
        nodeVersion: process.version,
        hostname: os.hostname(),
        loadAverage: os.loadavg(),
        totalMemory: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
        freeMemory: Math.round(os.freemem() / 1024 / 1024) + ' MB'
      },
      process: {
        pid: process.pid,
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
          external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        }
      },
      dependencies: {
        weatherService: {
          status: weatherServiceStatus,
          latency: weatherServiceLatency ? `${weatherServiceLatency}ms` : null,
          provider: 'OpenWeatherMap'
        }
      },
      config: {
        port: process.env.PORT || 3001,
        rateLimit: process.env.NODE_ENV === 'production' ? '100/15min' : '1000/15min',
        corsEnabled: true,
        compressionEnabled: true,
        helmetEnabled: true
      }
    };

    // Determine overall status based on dependencies
    if (weatherServiceStatus === 'unhealthy') {
      detailedHealth.status = 'degraded';
      detailedHealth.warnings = ['Weather service connectivity issues'];
    }

    res.json(detailedHealth);
    
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Ready check (for container orchestration)
router.get('/ready', (req, res) => {
  // Add any readiness checks here (DB connections, external services, etc.)
  const isReady = true; // Add your readiness logic
  
  if (isReady) {
    res.json({
      success: true,
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      success: false,
      status: 'not ready',
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check (for container orchestration)
router.get('/live', (req, res) => {
  res.json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;