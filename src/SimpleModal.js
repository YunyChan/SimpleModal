/**
 * Created by yunying on 2016/7/8.
 */
(function(oWin, oDoc){
    // Helper
    var Helper = {
        listenEvent: fListenEvent,
        getDOM: fGetDOM
    };

    function fListenEvent(oDom, sEventName, fCallback, bUseCapture){
        if(oWin.attachEvent){
            oDom.attachEvent('on' + sEventName, function(){
                var oEvent = oWin.event;
                fCallback && fCallback(oEvent);
            });
        }else{
            oDom.addEventListener(sEventName, fCallback, !!bUseCapture);
        }
    }

    function fGetDOM(oRoot, sQuery) {
        var sMatch = sQuery.match(/([\w\-]*)([\.#])([\w\-]*)/);
        var sTag = '';
        var sAttributeValue = '';
        var fIsMatch = null;
        if(sMatch.length > 1){
            sTag = sMatch[1];
            fIsMatch = sMatch[2] == '#' ? _fIsMatchById : _fIsMatchByClass;
            sAttributeValue = sMatch[3];
            var oDOMs = oRoot.getElementsByTagName(sTag);
            for(var cnt = 0, length = oDOMs.length; cnt < length; cnt ++){
                var oDOM = oDOMs[cnt];
                if(fIsMatch(oDOM, sAttributeValue)){
                    return oDOM;
                }
            }
        }
        return null;

        function _fIsMatchById(oDOM, sTargetId){
            return oDOM.id == sTargetId;
        }

        function _fIsMatchByClass(oDOM, sTargetClass){
            var oTargetClassRegExp = new RegExp(sTargetClass);
            return oTargetClassRegExp.test(oDOM.className);
        }
    }

    var SimpleModal = fConstructor;
    // 静态变量
    //SimpleModal.prototype.xxx = '';
    // 静态方法
    SimpleModal.prototype.init = fInit;
    SimpleModal.prototype.initEvents = fInitEvents;
    SimpleModal.prototype.render = fRender;
    SimpleModal.prototype.renderDOM = fRenderDOM;
    SimpleModal.prototype.renderMask = fRenderMask;
    SimpleModal.prototype.renderModal = fRenderModal;
    SimpleModal.prototype.center = fCenter;
    SimpleModal.prototype.setMaskHeight = fSetMaskHeight;
    SimpleModal.prototype.close = fClose;
    SimpleModal.prototype.show = fShow;
    SimpleModal.prototype.hide = fHide;


    function fConstructor(oConf){
        this.config = oConf = oConf || {};
        this.showClose = oConf.close === undefined ? true : oConf.close;
        this.title = oConf.title || '';
        this.content = oConf.content || '';
        this.operation = oConf.operation || '';
        this.isIE6 = /MSIE 6\.0/.test(window.navigator.userAgent);
        this.init();
        return this;
    }

    function fInit(){
        this.render();
        this.initEvents();
    }

    function fInitEvents() {
        var that = this;
        Helper.listenEvent(this.modal, 'click', function (oEvent) {
            var oClickDOM = oEvent.target || oEvent.srcElement;
            if(/simple-modal-close/.test(oClickDOM.className)){
                that.close();
            }
        })
    }

    function fRender() {
        this.renderDOM();
    }

    function fRenderDOM() {
        this.renderMask();
        this.renderModal();
        this.center();
    }

    function fRenderMask() {
        this.mask = oDoc.createElement('div');
        this.mask.className = 'simple-modal-mask';
        oDoc.body.appendChild(this.mask);
    }

    function fRenderModal() {
        this.modal = oDoc.createElement('div');
        this.modal.className = 'simple-modal';
        this.modal.innerHTML = [
            this.showClose ? '<a class="simple-modal-close">X</a>' : '',
            this.title ? '<div class="simple-modal-title">' + this.title + '</div>' : '',
            this.content ? '<div class="simple-modal-content">' + this.content + '</div>' : '',
            this.operation ? '<div class="simple-modal-operation">' + this.operation + '</div>': ''
        ].join('');
        oDoc.body.appendChild(this.modal);
    }

    function fCenter() {
        var nModalWidth = this.modal.clientWidth;
        var nModalHeight = this.modal.clientHeight;
        var nViewportWidth = oDoc.documentElement.clientWidth;
        var nViewportHeight = oDoc.documentElement.clientHeight;
        var nLeft = (nViewportWidth / 2) - (nModalWidth / 2);
        this.modal.style.left = nLeft + 'px';

        var nTop = 0;
        if(nModalHeight < nViewportHeight){
            nTop = (nViewportHeight / 2) - (nModalHeight / 2);
            this.modal.style.position = '';
        }else{
            this.modal.style.position = 'absolute';
        }
        this.modal.style.top = nTop + 'px';

        this.setMaskHeight();
    }

    function fSetMaskHeight() {
        var nViewportHeight = oDoc.documentElement.clientHeight;
        var nBodyHeight = oDoc.body.clientHeight;
        var nModalHeight = this.modal.clientHeight;
        if(nModalHeight > nViewportHeight){
            this.mask.style.height = nModalHeight + 'px';
        }else if(nBodyHeight > nViewportHeight){
            this.mask.style.height = nBodyHeight + 'px';
        }else{
            this.mask.style.height = nViewportHeight + 'px';
        }
    }

    function fClose() {
        oDoc.body.removeChild(this.modal);
        oDoc.body.removeChild(this.mask);
    }

    function fShow() {
        this.mask.style.display = '';
        this.modal.style.display = '';
    }

    function fHide() {
        this.modal.style.display = 'none';
        this.mask.style.display = 'none';
    }

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(function() {
            return SimpleModal;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = function(oConf){
            return new SimpleModal(oConf);
        };
        module.exports.SimpleModal = SimpleModal;
    } else {
        if(!oWin.SimpleModal){
            oWin.SimpleModal = SimpleModal;
        }else{
            throw new Error("It's duplicate to defined 'SimpleList', please check the scripts which you has been imported!");
        }
    }

})(window, document);