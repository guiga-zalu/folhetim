self.addEventListener('load', e => {
	const st = self.spentTime = {interval: 100, GET_URL: self.location.origin + '/estatisticas/spent-time/', time: 0};
	st.timer = self.setInterval(e => self.spentTime.time += st.interval, st.interval);
});
self.addEventListener('unload', e => {
	var st = self.spentTime;
	clearInterval(st.timer);
	let xht = new XMLHttpRequest();
	xht.open('GET', st.GET_URL + Math.floor(st.time * st.interval / 1000) + self.location.pathname);
	xht.send();
});