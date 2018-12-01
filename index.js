const c = document.getElementById("surface");
const ctx = c.getContext("2d");

const id = ctx.createImageData(1,1); // only do this once per page
const d  = id.data;                        // only do this once per page

const ballPosition = [ 0, 0, 50 ];
const bP = [1, 0, 50];
const ballColor = [ 0, 1, 0 ];
const bC = [1, 0, 0];
let ballSize = 1.3;

function putPixel(x, y, r, g, b, a) {
    ctx.fillStyle = `rgba(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)}, ${a})`;
    ctx.fillRect(x, y, 1, 1);
}

function addLight(position) {
    
}

function traceBall (a_Ray, position, size) {
    let v = math.subtract(a_Ray.Origin, position);
    let b = -math.dot(v, a_Ray.Direction);
    let det = (b * b) - math.dot(v, v) + size * size;

    let t_Dist = 9e9;

    if (det > 0) {
        det = Math.sqrt(det);
        let i1 = b - det;
        let i2 = b + det;
        if (i2 > 0) {
            if (i1 < 0) {
                t_Dist = i2;
            }
            else {
                t_Dist = i1;
            }
        }
    }

    return t_Dist;
}

function Trace(a_Ray) {
    let t_Dist1 = traceBall(a_Ray, ballPosition, ballSize);
    let t_Dist2 = traceBall(a_Ray, bP, ballSize);

    let t_Dist = (t_Dist1 < t_Dist2) ? t_Dist1 : t_Dist2;
    let color  = (t_Dist1 < t_Dist2) ? ballColor : bC;

    let hasHit = t_Dist < 9e9;
    return {
        "color": color,
        "hit": hasHit
    };
}

function vectorNormalize(v) {

    let length = Math.sqrt((v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]));

    v[0] /= length;
    v[1] /= length;
    v[2] /= length;

    return v;
}

function onFrame() {

    const t_Height = c.clientHeight;
    const t_Width = c.clientWidth;
    const fov = 65;
    const pi = 3.14159265359;

    let t_Ray = {
        "Origin": [ 0, 0, 0 ],
        "Direction": [ 0, 0, 0 ]
    };

    let t_Aspect = t_Width / t_Height;
    let t_X, t_Y;
    let t_Colour = [ 0, 0, 0 ];
    for (let y = 0; y < t_Height; y++) {
        for (let x = 0; x < t_Width; x++) {
            t_X = (2.0 * ((x + 0.5) / t_Width) - 1.0) * Math.tan(fov / 2.0 * pi / 180.0) * t_Aspect;
            t_Y = (1.0 - 2.0 * ((y + 0.5) / t_Height)) * Math.tan(fov / 2.0 * pi / 180.0);

            t_Ray.Direction = vectorNormalize([ t_X, t_Y, 1 ]);

            let result = Trace(t_Ray, t_Colour);
            if (result.hit !== true) continue;

            putPixel(x, y, result.color[0], result.color[1], result.color[2], 2.0);
        }
    }
    console.log("Done!");
}