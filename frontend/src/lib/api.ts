'use client'
import axios from 'axios'

const API = 'http://localhost:3000/api'

export const analyze = (data: any) => axios.post(`${API}/analyze`, data)
export const getHistory = () => axios.get(`${API}/history`)
export const getRecommendation = (id: number) => axios.get(`${API}/recommendation/${id}`)
export const recalculate = (data: any) => axios.post(`${API}/recalculate`, data)
export const getSummary = (id: number) => axios.get(`${API}/summary/${id}`)
export const deleteAnalysis = (id: number) => axios.delete(`${API}/delete/${id}`)
