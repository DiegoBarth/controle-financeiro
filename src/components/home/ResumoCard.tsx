import { numeroParaMoeda } from "../../utils/formatadores"

interface ResumoCardProps {
  titulo: string
  valor: number
  cor: string
  loading?: boolean
  icone?: React.ReactNode
}

export function ResumoCard({ titulo, valor, cor, loading, icone }: ResumoCardProps) {
  return (
    <div
      className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
      style={{ borderLeft: `5px solid ${cor}` }}
    >
      <div className="flex items-center gap-3">
        {icone && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ backgroundColor: `${cor}20` }}
          >
            <span style={{ color: cor }}>{icone}</span>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">{titulo}</p>
          {loading ? (
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <p className="text-lg font-semibold" style={{ color: cor }}>
              {numeroParaMoeda(valor)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}