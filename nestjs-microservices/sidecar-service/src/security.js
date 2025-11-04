import tls from 'tls'

export function verifyCert(host) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, host, { servername: host }, () => {
      const valid = socket.authorized || false
      socket.end()
      resolve(valid)
    })
    socket.on('error', reject)
  })
}
