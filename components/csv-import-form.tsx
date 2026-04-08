"use client"

import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { parsePortfolioCsv, type CsvImportResult } from "@/lib/csv-import"
import type { PortfolioHolding } from "@/lib/types"

interface Props {
  onImport: (holdings: PortfolioHolding[]) => void
  onCancel: () => void
}

export function CsvImportForm({ onImport, onCancel }: Props) {
  const [result, setResult] = useState<CsvImportResult | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (text) {
        setResult(parsePortfolioCsv(text))
      }
    }
    reader.readAsText(file)
  }

  const handleConfirm = () => {
    if (result && result.holdings.length > 0) {
      onImport(result.holdings)
    }
  }

  return (
    <div className="space-y-4">
      {!result ? (
        <>
          <div
            className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-300 mb-1">Click to upload a CSV file</p>
            <p className="text-xs text-slate-500">Columns needed: Symbol, Quantity, Cost Basis</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-400">Accepted column names:</p>
            <p>Symbol: symbol, ticker, stock</p>
            <p>Quantity: quantity, shares, qty</p>
            <p>Cost: cost basis, avg cost, cost, average cost</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <FileText className="h-4 w-4" />
            <span>{fileName}</span>
          </div>

          {result.holdings.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/30">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-green-300">{result.holdings.length} of {result.total} rows parsed successfully</p>
                <div className="mt-2 max-h-32 overflow-y-auto text-xs text-slate-400 space-y-0.5">
                  {result.holdings.map((h, i) => (
                    <div key={i}>{h.symbol} — {h.quantity} shares @ ${h.costBasis.toFixed(2)}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result.skipped.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/30">
              <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-amber-300">{result.skipped.length} row{result.skipped.length !== 1 ? "s" : ""} skipped</p>
                <div className="mt-1 text-xs text-slate-400 space-y-0.5">
                  {result.skipped.slice(0, 5).map((s, i) => <div key={i}>{s}</div>)}
                  {result.skipped.length > 5 && <div>...and {result.skipped.length - 5} more</div>}
                </div>
              </div>
            </div>
          )}

          {result.holdings.length === 0 && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">No valid holdings found. Check that your CSV has the required columns.</p>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} size="sm">Cancel</Button>
        {result && result.holdings.length > 0 && (
          <Button onClick={handleConfirm} size="sm" className="bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
            Import {result.holdings.length} holdings
          </Button>
        )}
        {result && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setResult(null); setFileName(null); if (fileRef.current) fileRef.current.value = "" }}
          >
            Try another file
          </Button>
        )}
      </div>
    </div>
  )
}
