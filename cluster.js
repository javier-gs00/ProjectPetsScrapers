let cluster = require('cluster')

if (cluster.isMaster) {
    // Count the machine cpu
    const cpuCount = require('os').cpus().length;

    // Create a worker for each cpu
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork()
    }

    // Message log workers
    cluster.on('online', function (worker) {
        console.log('Worker id: ' + worker.process.pid + ' spawned...')
    })

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        console.log('worker ${worker.id} exited, respawning....')
        cluster.fork()
    })
} else {
    require('./server')
}