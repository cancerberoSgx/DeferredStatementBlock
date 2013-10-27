# Deferred Statement Block

 A very small JavaScript library dependent on jQuery for defining executable block statements based on deferred objects (or promises). 
 
## Objective


 Let the user create a block of statements that will be executed sequentially. 
 Each statement is responsible of notifying when its done() instead of returning a value. 
 This resolves the problem of executing synchronously (execute the following only after the previous task has ended) 
 Several asynchronous tasks like ajax, wait for user events or element existence. Depends on jQuery. It heavily rely on jQuery Deferred (promises)
 
 Oriented on operations on the DOM like ajax, navigating, triggering clicks, waiting for conditions, etc.
 PRECONDITION ON THE DOM : be sure the document is not reloaded in between statements (for example when you click a link or navigate). 
 Current implementation is not focused on automation & asserts but on automating the navigation - user uses cases. 
 Useful for developers who wish to reproduce the same complicated user use case issue (or for getting just there before the error is reproducible) . Also for QA manual exploratory testing. 

## Usage

See test/test1.html for a simple working test. 