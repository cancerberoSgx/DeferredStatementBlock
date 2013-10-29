/*! deferred-statement-block 2013-10-27 */
var ns={};DeferredStatementBlock=ns,ns.StatementBlock=function(){this.statements=[]},ns.StatementBlock.prototype._wrap=function(a){var b=function(){var b=jQuery.Deferred();return a&&a.apply(this,[b]),b};return b},ns.StatementBlock.prototype._getNextStatement=function(){if(!this.statements.length)return null;var a=this.statements.splice(0,1);return a[0]},ns.StatementBlock.prototype._execNext=function(){var a=this,b=this._getNextStatement(),c=this._wrap(b),d=c.apply(this,arguments);return d.done(function(){a._execNext()}),c},ns.StatementBlock.prototype.exec=function(){return this.statements.length?this._execNext():void 0},ns.StatementBlock.prototype.append=ns.StatementBlock.prototype.add=function(a){var b=null;2==arguments.length&&(a=arguments[1],b=arguments[0]),b&&(a=this._resolveFromConfig(b,a)),this.statements.push(a)},ns.StatementBlock.prototype._resolveFromConfig=function(a,b){return a.delay?function(){setTimeout(b,a.delay)}:b},ns.StatementBlock.prototype.DEFAULT_WAIT_MS=500,ns.StatementBlock.prototype.config={waitMs:ns.StatementBlock.prototype.DEFAULT_WAIT_MS},ns.StatementBlock.prototype.waitUntil=function(a,b){b=b||this.config.waitMs;var c=jQuery.Deferred(),d=function(){a()&&(c.resolve(),clearInterval(e))},e=setInterval(d,b);return c},ns.StatementBlock.prototype.waitForElement=function(a,b){return this.waitUntil(function(){return jQuery(a).size()>0},b)},ns.StatementBlock.prototype.triggerEvent=function(a,b){"string"==typeof b&&(b=jQuery(b)),b.each(function(){var b=this;if(b.fireEvent)b.fireEvent("on"+a);else{var c=document.createEvent("Events");c.initEvent(a,!0,!1),b.dispatchEvent(c)}})};


//firts the namespace to work with
var ns = DeferredStatementBlock;

//then create the statement block
var block1 = new ns.StatementBlock();

//then add a statement that will wait for #p1 and when is available trigger an event on #button1 
block1.add(function(job) {
	block1.waitForElement('#p1').done(function() {
		console.log('p1 founded'); 
		block1.triggerEvent('click', '#button1');
		job.resolve(); //don't forget to return control to the next statement. 
	});
});