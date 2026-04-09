"use client";

import { useState, useCallback } from "react";

export default function AdminSettlePage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [settleResult, setSettleResult] = useState<{
    settled: number;
    errors: number;
    message: string;
  } | null>(null);
  const [settleLoading, setSettleLoading] = useState(false);
  const [settleError, setSettleError] = useState("");

  // Check sessionStorage on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("admin_token");
      if (saved) {
        setToken(saved);
        setAuthed(true);
      }
    }
  });

  const handleLogin = useCallback(async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        sessionStorage.setItem("admin_token", token);
        setAuthed(true);
      } else if (res.status === 500) {
        setAuthError("ADMIN_SECRET no está configurado en el servidor.");
      } else {
        setAuthError("Token inválido. Intenta de nuevo.");
      }
    } catch {
      setAuthError("Error de conexión.");
    } finally {
      setAuthLoading(false);
    }
  }, [token]);

  const handleSettle = useCallback(async () => {
    const savedToken = sessionStorage.getItem("admin_token");
    if (!savedToken) return;
    setSettleLoading(true);
    setSettleError("");
    setSettleResult(null);
    try {
      const res = await fetch("/api/admin/settle-predictions", {
        method: "POST",
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (!res.ok) {
        setSettleError(`Error ${res.status}: ${res.statusText}`);
        return;
      }
      const data = await res.json();
      setSettleResult(data);
    } catch {
      setSettleError("Error de conexión al settlear.");
    } finally {
      setSettleLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("admin_token");
    setAuthed(false);
    setToken("");
    setSettleResult(null);
    setSettleError("");
  }, []);

  // --- Login state ---
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0D2240] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-6 space-y-4">
          <h1 className="font-heading text-xl font-bold text-[#3D2B1F] text-center">
            Admin — Settle
          </h1>
          <p className="font-sans text-sm text-[#8B7355] text-center">
            Esta página es solo para administradores. Pega tu token para continuar.
          </p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="ADMIN_SECRET"
            className="w-full h-12 px-4 text-base font-mono border-2 border-[#8B7355]/30 rounded-sm bg-white text-[#3D2B1F] placeholder:text-[#8B7355]/40"
          />
          {authError && (
            <p className="font-sans text-sm text-[#C41E3A] text-center">{authError}</p>
          )}
          <button
            onClick={handleLogin}
            disabled={authLoading || !token}
            className="w-full h-12 bg-[#0D2240] text-[#F5C842] font-display uppercase tracking-wider text-sm font-bold rounded-sm disabled:opacity-50 transition-opacity"
          >
            {authLoading ? "Verificando..." : "Entrar"}
          </button>
        </div>
      </div>
    );
  }

  // --- Authed state ---
  return (
    <div className="min-h-screen bg-[#0D2240] px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-[#F5C842]">
            Settle de Predicciones
          </h1>
          <button
            onClick={handleLogout}
            className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors min-h-[44px] px-3"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Info */}
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5 space-y-3">
          <p className="font-sans text-sm text-[#3D2B1F]">
            Al presionar el botón, el sistema revisará todas las predicciones
            pendientes de días anteriores, consultará los resultados finales en
            la MLB API, y actualizará el historial con W/L.
          </p>
        </div>

        {/* Settle button */}
        <button
          onClick={handleSettle}
          disabled={settleLoading}
          className="w-full h-14 bg-[#2E7D32] text-white font-display uppercase tracking-wider text-base font-bold rounded-sm disabled:opacity-50 transition-opacity"
        >
          {settleLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Settleando...
            </span>
          ) : (
            "Settlear pendientes"
          )}
        </button>

        {/* Result */}
        {settleResult && (
          <div className="bg-[#FDF6E3] border-[3px] border-[#2E7D32] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5 space-y-2">
            <p className="font-heading text-lg font-bold text-[#2E7D32]">
              Resultado
            </p>
            <div className="space-y-1 font-mono text-sm text-[#3D2B1F]">
              <p>Settleados: <span className="font-bold">{settleResult.settled}</span></p>
              <p>Errores: <span className="font-bold">{settleResult.errors}</span></p>
              <p className="text-[#8B7355] text-xs">{settleResult.message}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {settleError && (
          <div className="bg-[#FDF6E3] border-[3px] border-[#C41E3A] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5">
            <p className="font-sans text-sm text-[#C41E3A]">{settleError}</p>
          </div>
        )}
      </div>
    </div>
  );
}
