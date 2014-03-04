var _crud = {
	ActivateSelectedButton : function(pType,fieldName){
		$('#'+fieldName).attr('value',pType);
		$('.ptypebutton_'+fieldName).removeClass('btn-success');
		$('#ptypebutton_'+fieldName+'_'+pType).addClass('btn-success');
	},
	ScanForButtonGroups : function(){
		var buttonGroupsInput = $('.btn-group input') ;
		for (var i=0;i<buttonGroupsInput.length;i++){
			var name = buttonGroupsInput[i].name ;
			var value = buttonGroupsInput[i].value ;
			this.ActivateSelectedButton(value,name) ;
		}
	},
	ShowHiddenSelects: function(){
		$('.bfh-selectbox').removeClass('hidden') ;
	},
	SetTitle: function(){
		if (typeof(crudTitle) !== 'undefined'){
			document.title = crudTitle ;
		}
	}
};

$(document).ready(function(){
	_crud.ScanForButtonGroups() ;
	_crud.ShowHiddenSelects();
	_crud.SetTitle();
});

