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

// Counters - a fragment shader in OpenGL, built on shadertoy.com;
// Function: display numbers;
// Author: John Lynch (@teraspora);
// Date: 25 SEP 2018.

int num;

const vec3 white =      vec3(1.,   1.,   1.  );
const vec3 black =      vec3(0.,   0.,   0.  );
const vec3 cyan =       vec3(0.0,  1.,   0.84);
const vec3 magenta =    vec3(1.0,  0.,   1.0 );
const vec3 blue =       vec3(0.0,  0.6,  0.84);
const vec3 gold =       vec3(1.0,  0.84, 0.66);
const vec3 orange =     vec3(1.0,  0.2,  0.0 );
const vec3 yellow =     vec3(1.0,  1.0,  0.0 );
const vec3 dark_blue =  vec3(0.0,  0.05, 0.15);
const vec3 crimson =    vec3(0.76, 0.0,  0.42);

vec3[] cols = vec3[](magenta, cyan, crimson, blue, orange, yellow);
int cl = cols.length();

// bitmaps of the 10 decimal digits, given in octal for ease of visualisation
const uint[] digits = uint[](07642424276u, 01010101010u, 07602764076u, 07602760276u,
                             04040447604u, 07640760276u, 04040764276u, 07602020202u,
                             07642764276u, 07642760202u);
    
// return the biggest prime less than n:
int largestPrimeLessThan(int n) {
    if (n < 3) return 2;
    bool prime[1000];
    for (int i = 0; i < prime.length(); i++) {
        prime[i] = true;
    }    
    for (int p = 2; p * p <= n; p++) { 
        if (prime[p]) { 
            for (int i = p * 2; i <= n; i += p) 
                prime[i] = false; 
        } 
    } 
    for (int i = n - 1; i >= 0; i--) {
        if (prime[i]) return i;
    }    
}

// MAIN METHOD:

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {    
    
    // Set this var to the number of tiles across and down:
    float tileDim = 2.;
    float numTiles = tileDim * tileDim;
    
    // some shorter names:
    float resx = iResolution.x;
    float resy = iResolution.y;
    vec2 f = fragCoord.xy;
    vec2 hr = iResolution.xy / tileDim;
    
    // MUTABLE VARIABLES
    float scaleFactor = 1.02;
    
    // ===============================================================
    // the output vector giving the position the program needs to know!-
    vec2 pp = f;
    // Make numTiles sub-frames:
    vec2 n = vec2(float(int(f.x / resx * tileDim)), float(int(f.y / resy * tileDim)));
    
    float tile = numTiles -(n.y * tileDim + n.x) - 1.;  // start at 1 so we don't lose stuff when multiplying
    float toe = fract(tile / 2.) * 4. - 1.; // returns 1. if tile index odd, -1. if even;
    float tile2 = tile * tile;
    
    // shift back to the first tile if in any other tile:
    pp.x -= hr.x * n.x;
    pp.y -= hr.y * n.y;
    // normalise to [0, 1[, shift to make unit quad with origin in centre
    vec2 q = pp / hr - 0.5;     // normalise
    // then scale:
    q /= scaleFactor;
    vec3 col;
    // ===============================================================
    
    // Main code here:
    
    int t = int(iTime);
    switch(int(tile)) {
        case 1:
        num = t;
            col = mix(gold, blue, sqrt(abs(sin(q.y))));
            col.g *= ((cos(iTime / 2.) + 1.) * 0.5);
            num = t;
            break;
        case 0:
            col = mix(orange, yellow, sin(q.y));
            col.b = (-sin(iTime / 3.) + 1.) * 0.5;
            num = t * t;
            break;
        case 2:
            col = mix(cyan, crimson, sin(q.y));
            col.g *= ((-cos(iTime / 5.) + 1.) * 0.5);
            num = largestPrimeLessThan(t);
            break;
        case 3: 
            col = mix(yellow, magenta, sin(q.y));
            col.g *= ((sin(iTime / 7.) + 1.) * 0.5);
            num = int(pow(2., floor(mod(iTime, 30.))));
            break;
    }    
    // We'll store the bitmaps of each digit here, pulling them out of
    // the digits[] array where they've been put:
    float rows = 5.;
    float columns = 54.;
    // width and height of a digit in rows of bit-blocks
    float dw = 6.;
    float dh = 5.;
    
    // populate the bitmap array with bitmaps for the appropriate digits:
    uint[] bitmap = uint[10](0u, 0u, 0u, 0u, 0u, 0u, 0u, 0u, 0u, 0u);
    for (int i = 0, divisor = 100000000; i < 9; i++, divisor /= 10) {   
        int m = num / divisor;
        bitmap[i] = digits[m];
        num -= m * divisor;
    }
    // Note: I wasted a lot of time using floats here and getting
    // numerical errors with large numbers.
    // Even tried making them all highp.
    // Eventually realised the only way was back to ints (which I would
    // certainly have used in any other language!)
    
    vec2 box = vec2(0.9, 0.2);
    vec2 padding = (-box + 1.) / 2.;
    
    // if fragCoord is inside the numeric display box, work out where that maps to
    // in the grid, get the appropriate bit and "AND" it with the base colour
    if (q.x >= -0.5 + padding.x && q.x < 0.5 - padding.x
            && q.y >= -0.5 + padding.y && q.y < 0.5 - padding.y) {
        
        vec2 p = (q * vec2(1., -1.) + vec2(0.5, 0.5) - padding) / box;
        float bx = float(p.x * columns);
        float by = float(p.y * rows);
        float place = bx / dw;
        float dx = bx - floor(place) * dw;
        float dy = floor(by);
        uint digit = bitmap[int(place)]; 
        int bitx = int(dy * dw + dx);
        int charSize = int(dw * dh);
        bitx = charSize - bitx ;
        col *= (1. - float((digit >> bitx) & 1u));        
    }       
    
    // End main code.    
    
    // ===============================================================
    // Make a border: 8px solid black; with line inset:
    float b = 6.;   // border width    
    vec3 borderInsetLineColour = white;
    
    // Make a line inset:
    if ((pp.x > b - 1. && pp.x <= b + 1.) || (pp.x > hr.x - b - 1. && pp.x < hr.x - b + 1.)) col = borderInsetLineColour;
    if ((pp.y > b - 1. && pp.y <= b + 1.) || (pp.y > hr.y - b - 1. && pp.y < hr.y - b + 1.)) col = borderInsetLineColour;
    
    // Now put a black border on top:
    col *= step(b, pp.x);
    col *= step(b, pp.y);
    col *= (1. - step(hr.x - b, pp.x));
    col *= (1. - step(hr.y - b, pp.y));    
    
    // and finally return the colour:
    fragColor = vec4(col, 1.0);
}
