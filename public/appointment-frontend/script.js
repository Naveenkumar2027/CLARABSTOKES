(function(){
  const qs = new URLSearchParams(location.search);
  const id = qs.get('id');
  const app = document.getElementById('app');
  const info = document.getElementById('info');
  const loading = document.getElementById('loading');
  const errorBox = document.getElementById('error');
  const errmsg = document.getElementById('errmsg');

  const apiBase = qs.get('api') || '';

  async function fetchDetails(appointmentId){
    // If deployed on Vercel, use the local serverless proxy which forwards to ?api=
    // Otherwise, fall back to same-origin API for local dev.
    const url = apiBase
      ? `/appointment-frontend/api/appointment?id=${encodeURIComponent(appointmentId)}&api=${encodeURIComponent(apiBase)}`
      : `/api/appointment/${encodeURIComponent(appointmentId)}`;
    const res = await fetch(url, { credentials: 'omit' });
    if(!res.ok) throw new Error(res.status === 404 ? 'Appointment not found' : 'Server error');
    return res.json();
  }

  function render(d){
    const rows = [
      ['Appointment ID', d.appointmentId],
      ['Client', d.clientName],
      ['Staff', d.staffName],
      ['Department', d.department || 'Computer Science Engineering'],
      ['Purpose', d.purpose || 'Video Consultation'],
      ['Date', d.date || new Date().toLocaleDateString()],
      ['Time', d.time || new Date().toLocaleTimeString()],
      ['Location', d.location || 'College Campus'],
      ['Status', d.status || 'confirmed'],
      ['CONTACT', (d.contact || d.staffEmail || 'STAFF@EXAMPLE.COM').toUpperCase()]
    ];
    info.innerHTML = rows.map(([k,v])=>`<p><strong>${k}:</strong> ${escapeHtml(String(v))}</p>`).join('');
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  async function init(){
    try{
      let data;
      if(id){
        data = await fetchDetails(id);
      } else {
        // sample demo data (for style preview)
        data = {
          appointmentId: 'call_1758460216159_8eigm830l',
          clientName: 'dhanush',
          staffName: 'Prof. Anitha C S',
          department: 'Computer Science Engineering',
          purpose: 'Video Consultation',
          date: '21/09/2025',
          time: '18:40:29',
          location: 'College Campus',
          status: 'confirmed',
          contact: 'STAFF@EXAMPLE.COM'
        };
      }
      render(data);
      loading.style.display='none';
      app.style.display='flex';
    }catch(err){
      loading.style.display='none';
      errorBox.style.display='flex';
      if(errmsg) errmsg.textContent = err.message || 'Unknown error';
      console.error(err);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


