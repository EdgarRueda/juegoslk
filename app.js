async function cargarPartidos() {
    try {
        const res = await fetch('/api/partidos');
        const partidos = await res.json();

        const contEnVivo = document.getElementById('contenedor-en-vivo');
        const contProximos = document.getElementById('contenedor-proximos');
        
        contEnVivo.innerHTML = '';
        contProximos.innerHTML = '';

        let enVivoCount = 0;
        let proximosCount = 0;

        partidos.forEach(p => {
            // Validar que la fila no esté vacía y que tenga estado
            if (!p.Estado) return;

            const estadoLower = p.Estado.toLowerCase();
            const isLive = estadoLower.includes('en vivo');
            const isUpcoming = estadoLower.includes('próximo') || estadoLower.includes('proximo');

            // Solo renderizamos los que están en vivo o próximos
            if (!isLive && !isUpcoming) return;

            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <div class="card-header">
                    <span>⚽ ${p.Deporte}</span>
                    <span class="${isLive ? 'badge-live' : 'badge-upcoming'}">
                        ${isLive ? '🔴 EN VIVO' : '⏳ PRÓXIMO'}
                    </span>
                </div>
                <div class="equipo-row">
                    <span>${p.EquipoLocal}</span>
                    <span class="score ${isLive ? 'live-score' : ''}">${p.MarcadorLocal || 0}</span>
                </div>
                <div class="equipo-row">
                    <span>${p.EquipoVisita}</span>
                    <span class="score ${isLive ? 'live-score' : ''}">${p.MarcadorVisita || 0}</span>
                </div>
                <div class="time-info">
                    ⌚ Inicio: ${p.HoraInicio} | Fin aprox: ${p.HoraFin}
                </div>
            `;

            if (isLive) {
                contEnVivo.appendChild(card);
                enVivoCount++;
            } else if (isUpcoming) {
                contProximos.appendChild(card);
                proximosCount++;
            }
        });

        if(enVivoCount === 0) contEnVivo.innerHTML = '<p style="color: #64748b;">No hay partidos en este momento.</p>';
        if(proximosCount === 0) contProximos.innerHTML = '<p style="color: #64748b;">No hay próximos partidos programados.</p>';

    } catch (error) {
        console.error('Error de red o de servidor:', error);
    }
}

// Carga inicial
cargarPartidos();

// Refrescar automáticamente cada 15 segundos
setInterval(cargarPartidos, 15000);