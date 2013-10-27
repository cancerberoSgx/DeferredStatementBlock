/* 

 Deferred Statement Block - let the user create a block of statements that will be executed sequentially. 
 Each statement is resposible of notifying when its done() instead of returning a value. 
 This resolves the problem of executing synchronously (execute the following only after the previous task has ended) 
 Several asynchronous tasks like ajax, wait for user events or element existence. Depends on jQuery. It heavily rely on jQuery Deferred (promises)
 
 Oriented on operations on the DOM like ajax, navigating, triggering clicks, waiting for conditions, etc.
 PRECONDITION ON THE DOM : be sure the document is not reloaded in between statements (for example when you click a link or navigate). 
 Current implementation is not focused on automation & asserts but on automating the navigation - user uses cases. 
 Useful for developers who wish to reproduce the same complicated user use case issue (or for getting just there before the error is reproducible) . Also for QA manual exploratory testing. 

 @author sgurin
 
 */
var ns = {}; 
DeferredStatementBlock=ns;//global namespace. 
ns.StatementBlock = function() {
	this.statements = [];
}; 

ns.StatementBlock.prototype._wrap = function(fn) {
//	var self = this;
	var wrapper = function() {
		var promise = jQuery.Deferred();
		if (fn)
			fn.apply(this, [ promise ]); // execute the original fn,
		// fn(promise);
		return promise;
	}; 
	return wrapper;
}; 

ns.StatementBlock.prototype._getNextStatement = function() {
	if (!this.statements.length)
		return null; 
	var ret = this.statements.splice(0, 1);
	return ret[0];
}; 

/** @return Function function that perform the statemetn and return a promise */
ns.StatementBlock.prototype._execNext = function() {
	var self = this;
	var nextStatement = this._getNextStatement();
	var wrap = this._wrap(nextStatement);
	var promise = wrap.apply(this, arguments); // execute it!
	promise.done(function() {
		self._execNext();
	}); 
	return wrap;
}; 

/** @return Function that perform the statemetn and return a promise */
ns.StatementBlock.prototype.exec = function() {
	if (!this.statements.length)
		return;
	return this._execNext();
}; 

ns.StatementBlock.prototype.append = ns.StatementBlock.prototype.add = function(
		fn) {
	var config = null;
	if (arguments.length == 2) {
		fn = arguments[1];
		config = arguments[0];
	}
	if (config) {
		fn = this._resolveFromConfig(config, fn);
	}
	this.statements.push(fn);
}; 

ns.StatementBlock.prototype._resolveFromConfig = function(config, fn) {
	if (config.delay) {
		return function() {
			setTimeout(fn, config.delay); 
		};
	} else {
		return fn;
	}
}; 
/** @constant number DEFAULT_WAIT_MS default amount of milliseconds to wait used by wait* methods. */  
ns.StatementBlock.prototype.DEFAULT_WAIT_MS = 500;
ns.StatementBlock.prototype.config = {
	waitMs : ns.StatementBlock.prototype.DEFAULT_WAIT_MS
};
// extension waitUntil
/**
 * @return a promise. This function will be periodically checking if the
 *         parameter condition is true and when it so it will resolve the
 *         promise.
 */
ns.StatementBlock.prototype.waitUntil = function(condition, checkMs) { // TODO:timeout
	checkMs = checkMs || this.config.waitMs; 
	var promise = jQuery.Deferred();
	var callback = function() {
		if (condition()) {
			promise.resolve();
			clearInterval(timer);
		}
	}; 
	var timer = setInterval(callback, checkMs);
	return promise;
};
// ns.StatementBlock.prototype.waitAnd = function(condition, fn, checkMs) {
// var self = this;
// return this.waitUntil(condition, checkMs).done(function(){fn.apply(self,
// arguments)});
// }
ns.StatementBlock.prototype.waitForElement = function(selector, checkMs) {
	return this.waitUntil(function() {
		return jQuery(selector).size() > 0;
	}, checkMs);
};
// ns.StatementBlock.prototype.waitForElementAnd = function(selector, fn,
// checkMs){
// var self = this;
// return this.waitForElement(selector, checkMs).done(function(){fn.apply(self,
// arguments)});
// }

// idea - alternative waitFor syntax:
// block1.add(new WaitForElement(block1, '[data-trigger="go-to-cart"]',
// function(){
// block1.triggerClick(gotocart);
// }));

// function WaitForElement(block, el, and) {
// this.block=block;
// this.el=el;
// this.and=and;
// }
// WaitForElement.prototype.resolve=function(){
// var self=this;
// var f = function(job){
// block.waitForElement(self.el).done(function(){
// this.and.apply(self, arguments); // block1.triggerEvent('click', gotocart);
// //block1.navigate('#/cart');//block1.triggerEvent('click', gotocart);
// //block1.navigateLink(aProduct); //block1.triggerEvent('click',
// '.item-cell-thumbnail>a:first');
// job.resolve();
// });
// };
// return f;
// }

// extension DOM EVENT TRIGGERING
/** 
 * the most native trigger event operation 
 */
ns.StatementBlock.prototype.triggerEvent = function(etype, $el) {
	if (typeof($el) === 'string')
		$el = jQuery($el);
	$el.each(function() {
		var el = this;
		if (el.fireEvent) {
			(el.fireEvent('on' + etype));
		} else {
			var evObj = document.createEvent('Events');
			evObj.initEvent(etype, true, false);
			el.dispatchEvent(evObj);
		}
	});
};
