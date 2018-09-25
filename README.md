# Counters:  Demonstration of outputting numbers in a shader.

This shader shows how to output numbers to the screen, using 5x5 bitmaps to make old-style calculator digits.
For demonstration's sake, it displays four panes, showing 
* The running time in seconds
* The square of this number
* The largest prime number less than it
* A repeating display of the powers of 2 with fewer than ten digits

The code for the four panes is from my "Polypane" shader, to be found at
https://www.shadertoy.com/view/4tVcDK and
https://github.com/teraspora/polypane.

## Execution

Go to https://www.shadertoy.com/view/MtKyDK.
Play with it by looking inside the `case` blocks and changing the functions used to define `num`.

## To do

Add more bitmaps for letters, punctuation and custom icons.
Note, will have to target them with ASCII codes for example, as GLSL has no strings.

## Author

John Lynch
Sep. 2018.

## Licence

// The MIT License
// Copyright © 2018 John Lynch
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so, subject
// to the following conditions: The above copyright notice and this permission
// notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.