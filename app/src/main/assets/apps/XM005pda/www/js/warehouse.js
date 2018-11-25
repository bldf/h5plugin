LL.removeItem('AWAREHOUSE');
function tapCall(obj){
	LL.AWAREHOUSE =obj.id ; 
	M.goT('warehouseList.html',obj.partNo+'('+obj.num+')');
}