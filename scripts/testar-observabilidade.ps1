param(
    [string]$Projeto = 'C:\Projetos\literalura-one-challenge-Springboot-Java'
)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
Set-Location -LiteralPath $Projeto
Write-Host "`n=== TESTES DE OBSERVABILIDADE V2.1 ===" -ForegroundColor Cyan
$rotas = @('/autores','/livros','/actuator/health','/actuator/prometheus')
foreach ($rota in $rotas) {
    $url = 'http://127.0.0.1:8081' + $rota
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
    if ($resp.StatusCode -ne 200) { throw "HTTP_FAIL=$rota" }
    Write-Host "HTTP_200=$rota" -ForegroundColor Green
    if ($rota -eq '/actuator/health') {
                $corpo = if ($resp.Content -is [byte[]]) {
            [System.Text.Encoding]::UTF8.GetString($resp.Content)
        } else {
            [string]$resp.Content
        }
        $json = ConvertFrom-Json -InputObject $corpo
        if ($json.status -ne 'UP') { throw 'ACTUATOR_HEALTH_NOT_UP' }
        Write-Host 'ACTUATOR_HEALTH=UP' -ForegroundColor Green
    }
    if ($rota -eq '/actuator/prometheus' -and $resp.Content -notmatch 'jvm_memory_used_bytes') {
        throw 'METRICAS_JVM_NAO_ENCONTRADAS'
    }
}
$prom = Invoke-RestMethod 'http://127.0.0.1:9091/api/v1/query?query=up%7Bjob%3D%22literalura-api%22%7D' -TimeoutSec 20
if ($prom.status -ne 'success' -or @($prom.data.result).Count -lt 1) { throw 'PROMETHEUS_SEM_COLETA' }
$valor = [string]$prom.data.result[0].value[1]
if ($valor -ne '1') { throw "PROMETHEUS_TARGET_NOT_UP=$valor" }
Write-Host 'PROMETHEUS_SCRAPE=PASS' -ForegroundColor Green
$grafana = Invoke-RestMethod 'http://127.0.0.1:3002/api/health' -TimeoutSec 20
if ($grafana.database -ne 'ok') { throw 'GRAFANA_DATABASE_NOT_OK' }
Write-Host 'GRAFANA_HEALTH=PASS' -ForegroundColor Green
Write-Host "`nOBSERVABILIDADE_V21_TESTES=PASS" -ForegroundColor Green
Write-Host 'Painel: http://127.0.0.1:3002/d/literalura-v21/literalura-observabilidade-v2-1' -ForegroundColor Cyan
Write-Host 'Usuario: admin. Senha: consulte LITERALURA_GRAFANA_PASSWORD no .env.sicredi (nao compartilhe).' -ForegroundColor Yellow
