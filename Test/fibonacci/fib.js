function fibonacci(n) {
    output = []
    if (n===1) {
        output = [0]
    }
    else if (n===2) {
        output = [0,1]
    }
    else {
        output = [0,1]
        for (var i = 2; i < n; i++) {
        f = output[output.length  - 2] + output[output.length -1]
        output.push(f) 
        }
    
    }
  return output
 }
    
function displayFibonacci() {
    var input = document.getElementById("input").value;
    var result = fibonacci(input);
    var output = document.getElementById("output");
    output.innerHTML = result;
}