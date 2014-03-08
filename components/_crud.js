var _crud = {

	addedClasses: [] ,


	sectionHide: function(section,time){
		$('#sectionBtn_'+section).removeClass('glyphicon-eye-open') ;
		$('#sectionBtn_'+section).addClass('glyphicon-eye-close') ;
		$('#section_'+section).hide(time) ;
	},

	sectionShow: function(section,time){
		$('#sectionBtn_'+section).removeClass('glyphicon-eye-close') ;
		$('#sectionBtn_'+section).addClass('glyphicon-eye-open') ;
		$('#section_'+section).show(time) ;
	},

	sectionToggle : function(section){
		if($('#sectionBtn_'+section).hasClass('glyphicon-eye-open')){
			this.sectionHide(section,300) ;
		} else {
			this.sectionShow(section,300) ;
		}
	},

	ActivateSelectedButtonInCompare : function(pType,fieldName){
		this.addedClasses.push(pType) ;
		for (var i=0;i<this.addedClasses.length;i++){
			var addedClass = this.addedClasses[i] ;
			$('.ptypebutton_'+fieldName).removeClass('btn-'+addedClass);
		}
		
		$('#ptypebutton_'+fieldName+'_'+pType).addClass('btn-'+pType);
		$('#ptypebutton_list_'+fieldName+'_'+pType).addClass('btn-'+pType);
		$('.compareBtn').not('.compare_'+pType).hide();
		$('.compare_alert-'+pType).show();
		$('.compare_'+pType).show();
	},

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
	if (_crud_documentReady) _crud_documentReady();
});

