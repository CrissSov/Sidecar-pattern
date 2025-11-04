import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'

export function setupTracing() {
  const exporter = new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
  })

  const sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  })

  sdk.start()
  console.log('🧭 Tracing started with Jaeger')
}
