import { useCallback, useMemo, useState } from 'react'
import { INITIAL_FORM, SAMPLE_FORM } from '@/constants/prediction'
import { buildPredictPayload } from '@/utils/prediction'
import type { FormData } from '@/types/prediction'

type FormErrors = Partial<Record<keyof FormData, string>>

export function useTransactionForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  const setField = useCallback((k: keyof FormData, v: string | boolean) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: undefined }))
  }, [])

  const loadSample = useCallback(() => {
    setForm(SAMPLE_FORM)
    setErrors({})
  }, [])

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM)
    setErrors({})
  }, [])

  const validate = useCallback(() => {
    const e: FormErrors = {}
    if (!form.amount || Number.isNaN(+form.amount) || +form.amount <= 0) e.amount = 'Enter a valid amount'
    if (form.transaction_velocity === '' || Number.isNaN(+form.transaction_velocity)) e.transaction_velocity = 'Required'
    if (form.amount_vs_avg_ratio === '' || Number.isNaN(+form.amount_vs_avg_ratio)) e.amount_vs_avg_ratio = 'Required'
    const ratios: (keyof FormData)[] = [
      'cash_ratio_monthly',
      'same_amount_frequency',
      'bulk_transaction_ratio',
      'tax_gap',
      'profit_margin',
      'discount_frequency',
      'refund_rate',
      'client_concentration_ratio',
    ]
    ratios.forEach((f) => {
      const v = Number(form[f])
      if (form[f] === '' || Number.isNaN(v) || v < 0 || v > 1) e[f] = '0 - 1'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const payload = useMemo(() => buildPredictPayload(form), [form])
  return { form, errors, setField, loadSample, resetForm, validate, payload }
}
