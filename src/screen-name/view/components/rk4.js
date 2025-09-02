// vdotx equation
var vdotx = function (q, m, Ex, vy, Bz, vz, By) {
    return (q / m) * (Ex + vy * Bz - vz * By);
};
// vdoty equation
// q/m *(Ey + vz*Bx - vx*Bz)
var vdoty = function (q, m, Ey, vz, Bx, vx, Bz) {
    return (q / m) * (Ey + vz * Bx - vx * Bz);
};
// vdotz equation
// q/m *(Ez + vx*By - vy*Bx)
var vdotz = function (q, m, Ez, vx, By, vy, Bx) {
    return (q / m) * (Ez + vx * By - vy * Bx);
};
var derive = function (q, m, state, Ex, Ey, Ez, Bx, By, Bz) {
    var x = state[0], y = state[1], z = state[2], vx = state[3], vy = state[4], vz = state[5];
    // placeholder for derived calculations
    return [
        vx,
        vy,
        vz,
        vdotx(q, m, Ex, vy, Bz, vz, By),
        vdoty(q, m, Ey, vz, Bx, vx, Bz),
        vdotz(q, m, Ez, vx, By, vy, Bx),
    ];
};
function rk4(state, dt, q, m, Ex, Ey, Ez, Bx, By, Bz) {
    // console.log(`rk4: ${values}`);
    var k1 = derive(q, m, state, Ex, Ey, Ez, Bx, By, Bz);
    var state2 = state.map(function (val, i) { return val + (dt * k1[i]) / 2; });
    var k2 = derive(q, m, state2, Ex, Ey, Ez, Bx, By, Bz);
    var state3 = state.map(function (val, i) { return val + (dt * k2[i]) / 2; });
    var k3 = derive(q, m, state3, Ex, Ey, Ez, Bx, By, Bz);
    var state4 = state.map(function (val, i) { return val + dt * k3[i]; });
    var k4 = derive(q, m, state4, Ex, Ey, Ez, Bx, By, Bz);
    return state.map(function (val, i) {
        return val + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    });
}
// Initial state: [x, y, z, vx, vy, vz]
var initialState = [0, 0, 0, 1, 0, 0];
var dt = 0.01; // time step
var q = 1.6e-19; // charge
var m = 9.1e-31; // mass
// Electric and magnetic field components
var Ex = 0, Ey = 0, Ez = 0;
var Bx = 0, By = 0, Bz = 1;
var newState = rk4(initialState, dt, q, m, Ex, Ey, Ez, Bx, By, Bz);
console.log('Initial State:', newState);
// export default rk4;
