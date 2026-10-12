var lf = { exports: {} }, Fl = {};
var l0;
function Mb() {
  if (l0) return Fl;
  l0 = 1;
  var a = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.fragment");
  function o(r, c, d) {
    var h = null;
    if (d !== void 0 && (h = "" + d), c.key !== void 0 && (h = "" + c.key), "key" in c) {
      d = {};
      for (var m in c)
        m !== "key" && (d[m] = c[m]);
    } else d = c;
    return c = d.ref, {
      $$typeof: a,
      type: r,
      key: h,
      ref: c !== void 0 ? c : null,
      props: d
    };
  }
  return Fl.Fragment = l, Fl.jsx = o, Fl.jsxs = o, Fl;
}
var u0;
function xb() {
  return u0 || (u0 = 1, lf.exports = Mb()), lf.exports;
}
var Ut = xb(), uf = { exports: {} }, kl = {}, sf = { exports: {} }, of = {};
var s0;
function Cb() {
  return s0 || (s0 = 1, (function(a) {
    function l(G, K) {
      var k = G.length;
      G.push(K);
      t: for (; 0 < k; ) {
        var mt = k - 1 >>> 1, yt = G[mt];
        if (0 < c(yt, K))
          G[mt] = K, G[k] = yt, k = mt;
        else break t;
      }
    }
    function o(G) {
      return G.length === 0 ? null : G[0];
    }
    function r(G) {
      if (G.length === 0) return null;
      var K = G[0], k = G.pop();
      if (k !== K) {
        G[0] = k;
        t: for (var mt = 0, yt = G.length, Te = yt >>> 1; mt < Te; ) {
          var xn = 2 * (mt + 1) - 1, Ei = G[xn], A = xn + 1, H = G[A];
          if (0 > c(Ei, k))
            A < yt && 0 > c(H, Ei) ? (G[mt] = H, G[A] = k, mt = A) : (G[mt] = Ei, G[xn] = k, mt = xn);
          else if (A < yt && 0 > c(H, k))
            G[mt] = H, G[A] = k, mt = A;
          else break t;
        }
      }
      return K;
    }
    function c(G, K) {
      var k = G.sortIndex - K.sortIndex;
      return k !== 0 ? k : G.id - K.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      a.unstable_now = function() {
        return d.now();
      };
    } else {
      var h = Date, m = h.now();
      a.unstable_now = function() {
        return h.now() - m;
      };
    }
    var S = [], p = [], v = 1, g = null, b = 3, _ = !1, R = !1, B = !1, V = !1, Q = typeof setTimeout == "function" ? setTimeout : null, Y = typeof clearTimeout == "function" ? clearTimeout : null, Z = typeof setImmediate < "u" ? setImmediate : null;
    function q(G) {
      for (var K = o(p); K !== null; ) {
        if (K.callback === null) r(p);
        else if (K.startTime <= G)
          r(p), K.sortIndex = K.expirationTime, l(S, K);
        else break;
        K = o(p);
      }
    }
    function at(G) {
      if (B = !1, q(G), !R)
        if (o(S) !== null)
          R = !0, ot || (ot = !0, Ht());
        else {
          var K = o(p);
          K !== null && wt(at, K.startTime - G);
        }
    }
    var ot = !1, w = -1, L = 5, pt = -1;
    function rt() {
      return V ? !0 : !(a.unstable_now() - pt < L);
    }
    function Yt() {
      if (V = !1, ot) {
        var G = a.unstable_now();
        pt = G;
        var K = !0;
        try {
          t: {
            R = !1, B && (B = !1, Y(w), w = -1), _ = !0;
            var k = b;
            try {
              e: {
                for (q(G), g = o(S); g !== null && !(g.expirationTime > G && rt()); ) {
                  var mt = g.callback;
                  if (typeof mt == "function") {
                    g.callback = null, b = g.priorityLevel;
                    var yt = mt(
                      g.expirationTime <= G
                    );
                    if (G = a.unstable_now(), typeof yt == "function") {
                      g.callback = yt, q(G), K = !0;
                      break e;
                    }
                    g === o(S) && r(S), q(G);
                  } else r(S);
                  g = o(S);
                }
                if (g !== null) K = !0;
                else {
                  var Te = o(p);
                  Te !== null && wt(
                    at,
                    Te.startTime - G
                  ), K = !1;
                }
              }
              break t;
            } finally {
              g = null, b = k, _ = !1;
            }
            K = void 0;
          }
        } finally {
          K ? Ht() : ot = !1;
        }
      }
    }
    var Ht;
    if (typeof Z == "function")
      Ht = function() {
        Z(Yt);
      };
    else if (typeof MessageChannel < "u") {
      var Lt = new MessageChannel(), Se = Lt.port2;
      Lt.port1.onmessage = Yt, Ht = function() {
        Se.postMessage(null);
      };
    } else
      Ht = function() {
        Q(Yt, 0);
      };
    function wt(G, K) {
      w = Q(function() {
        G(a.unstable_now());
      }, K);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(G) {
      G.callback = null;
    }, a.unstable_forceFrameRate = function(G) {
      0 > G || 125 < G ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : L = 0 < G ? Math.floor(1e3 / G) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return b;
    }, a.unstable_next = function(G) {
      switch (b) {
        case 1:
        case 2:
        case 3:
          var K = 3;
          break;
        default:
          K = b;
      }
      var k = b;
      b = K;
      try {
        return G();
      } finally {
        b = k;
      }
    }, a.unstable_requestPaint = function() {
      V = !0;
    }, a.unstable_runWithPriority = function(G, K) {
      switch (G) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          G = 3;
      }
      var k = b;
      b = G;
      try {
        return K();
      } finally {
        b = k;
      }
    }, a.unstable_scheduleCallback = function(G, K, k) {
      var mt = a.unstable_now();
      switch (typeof k == "object" && k !== null ? (k = k.delay, k = typeof k == "number" && 0 < k ? mt + k : mt) : k = mt, G) {
        case 1:
          var yt = -1;
          break;
        case 2:
          yt = 250;
          break;
        case 5:
          yt = 1073741823;
          break;
        case 4:
          yt = 1e4;
          break;
        default:
          yt = 5e3;
      }
      return yt = k + yt, G = {
        id: v++,
        callback: K,
        priorityLevel: G,
        startTime: k,
        expirationTime: yt,
        sortIndex: -1
      }, k > mt ? (G.sortIndex = k, l(p, G), o(S) === null && G === o(p) && (B ? (Y(w), w = -1) : B = !0, wt(at, k - mt))) : (G.sortIndex = yt, l(S, G), R || _ || (R = !0, ot || (ot = !0, Ht()))), G;
    }, a.unstable_shouldYield = rt, a.unstable_wrapCallback = function(G) {
      var K = b;
      return function() {
        var k = b;
        b = K;
        try {
          return G.apply(this, arguments);
        } finally {
          b = k;
        }
      };
    };
  })(of)), of;
}
var o0;
function Ob() {
  return o0 || (o0 = 1, sf.exports = Cb()), sf.exports;
}
var rf = { exports: {} }, it = {};
var r0;
function zb() {
  if (r0) return it;
  r0 = 1;
  var a = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.portal"), o = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), c = /* @__PURE__ */ Symbol.for("react.profiler"), d = /* @__PURE__ */ Symbol.for("react.consumer"), h = /* @__PURE__ */ Symbol.for("react.context"), m = /* @__PURE__ */ Symbol.for("react.forward_ref"), S = /* @__PURE__ */ Symbol.for("react.suspense"), p = /* @__PURE__ */ Symbol.for("react.memo"), v = /* @__PURE__ */ Symbol.for("react.lazy"), g = /* @__PURE__ */ Symbol.for("react.activity"), b = /* @__PURE__ */ Symbol.for("react.view_transition"), _ = Symbol.iterator;
  function R(A) {
    return A === null || typeof A != "object" ? null : (A = _ && A[_] || A["@@iterator"], typeof A == "function" ? A : null);
  }
  var B = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, V = Object.assign, Q = {};
  function Y(A, H, $) {
    this.props = A, this.context = H, this.refs = Q, this.updater = $ || B;
  }
  Y.prototype.isReactComponent = {}, Y.prototype.setState = function(A, H) {
    if (typeof A != "object" && typeof A != "function" && A != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, A, H, "setState");
  }, Y.prototype.forceUpdate = function(A) {
    this.updater.enqueueForceUpdate(this, A, "forceUpdate");
  };
  function Z() {
  }
  Z.prototype = Y.prototype;
  function q(A, H, $) {
    this.props = A, this.context = H, this.refs = Q, this.updater = $ || B;
  }
  var at = q.prototype = new Z();
  at.constructor = q, V(at, Y.prototype), at.isPureReactComponent = !0;
  var ot = Array.isArray;
  function w() {
  }
  var L = { H: null, A: null, T: null, S: null }, pt = Object.prototype.hasOwnProperty;
  function rt(A, H, $) {
    var tt = $.ref;
    return {
      $$typeof: a,
      type: A,
      key: H,
      ref: tt !== void 0 ? tt : null,
      props: $
    };
  }
  function Yt(A, H) {
    return rt(A.type, H, A.props);
  }
  function Ht(A) {
    return typeof A == "object" && A !== null && A.$$typeof === a;
  }
  function Lt(A) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + A.replace(/[=:]/g, function($) {
      return H[$];
    });
  }
  var Se = /\/+/g;
  function wt(A, H) {
    return typeof A == "object" && A !== null && A.key != null ? Lt("" + A.key) : H.toString(36);
  }
  function G(A) {
    switch (A.status) {
      case "fulfilled":
        return A.value;
      case "rejected":
        throw A.reason;
      default:
        switch (typeof A.status == "string" ? A.then(w, w) : (A.status = "pending", A.then(
          function(H) {
            A.status === "pending" && (A.status = "fulfilled", A.value = H);
          },
          function(H) {
            A.status === "pending" && (A.status = "rejected", A.reason = H);
          }
        )), A.status) {
          case "fulfilled":
            return A.value;
          case "rejected":
            throw A.reason;
        }
    }
    throw A;
  }
  function K(A, H, $, tt, vt) {
    var St = typeof A;
    (St === "undefined" || St === "boolean") && (A = null);
    var Et = !1;
    if (A === null) Et = !0;
    else
      switch (St) {
        case "bigint":
        case "string":
        case "number":
          Et = !0;
          break;
        case "object":
          switch (A.$$typeof) {
            case a:
            case l:
              Et = !0;
              break;
            case v:
              return Et = A._init, K(
                Et(A._payload),
                H,
                $,
                tt,
                vt
              );
          }
      }
    if (Et)
      return vt = vt(A), Et = tt === "" ? "." + wt(A, 0) : tt, ot(vt) ? ($ = "", Et != null && ($ = Et.replace(Se, "$&/") + "/"), K(vt, H, $, "", function(Cn) {
        return Cn;
      })) : vt != null && (Ht(vt) && (vt = Yt(
        vt,
        $ + (vt.key == null || A && A.key === vt.key ? "" : ("" + vt.key).replace(
          Se,
          "$&/"
        ) + "/") + Et
      )), H.push(vt)), 1;
    Et = 0;
    var F = tt === "" ? "." : tt + ":";
    if (ot(A))
      for (var nt = 0; nt < A.length; nt++)
        tt = A[nt], St = F + wt(tt, nt), Et += K(
          tt,
          H,
          $,
          St,
          vt
        );
    else if (nt = R(A), typeof nt == "function")
      for (A = nt.call(A), nt = 0; !(tt = A.next()).done; )
        tt = tt.value, St = F + wt(tt, nt++), Et += K(
          tt,
          H,
          $,
          St,
          vt
        );
    else if (St === "object") {
      if (typeof A.then == "function")
        return K(
          G(A),
          H,
          $,
          tt,
          vt
        );
      throw H = String(A), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Et;
  }
  function k(A, H, $) {
    if (A == null) return A;
    var tt = [], vt = 0;
    return K(A, tt, "", "", function(St) {
      return H.call($, St, vt++);
    }), tt;
  }
  function mt(A) {
    if (A._status === -1) {
      var H = A._result, $ = H();
      $.then(
        function(tt) {
          (A._status === 0 || A._status === -1) && (A._status = 1, A._result = tt, $.status === void 0 && ($.status = "fulfilled", $.value = tt));
        },
        function(tt) {
          (A._status === 0 || A._status === -1) && (A._status = 2, A._result = tt, $.status === void 0 && ($.status = "rejected", $.reason = tt));
        }
      ), A._status === -1 && (A._status = 0, A._result = $);
    }
    if (A._status === 1) return A._result.default;
    throw A._result;
  }
  var yt = typeof reportError == "function" ? reportError : function(A) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var H = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
        error: A
      });
      if (!window.dispatchEvent(H)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", A);
      return;
    }
    console.error(A);
  };
  function Te(A) {
    var H = L.T, $ = {};
    $.types = H !== null ? H.types : null, L.T = $;
    try {
      var tt = A(), vt = L.S;
      vt !== null && vt($, tt), typeof tt == "object" && tt !== null && typeof tt.then == "function" && tt.then(w, yt);
    } catch (St) {
      yt(St);
    } finally {
      H !== null && $.types !== null && (H.types = $.types), L.T = H;
    }
  }
  function xn(A) {
    var H = L.T;
    if (H !== null) {
      var $ = H.types;
      $ === null ? H.types = [A] : $.indexOf(A) === -1 && $.push(A);
    } else Te(xn.bind(null, A));
  }
  var Ei = {
    map: k,
    forEach: function(A, H, $) {
      k(
        A,
        function() {
          H.apply(this, arguments);
        },
        $
      );
    },
    count: function(A) {
      var H = 0;
      return k(A, function() {
        H++;
      }), H;
    },
    toArray: function(A) {
      return k(A, function(H) {
        return H;
      }) || [];
    },
    only: function(A) {
      if (!Ht(A))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return A;
    }
  };
  return it.Activity = g, it.Children = Ei, it.Component = Y, it.Fragment = o, it.Profiler = c, it.PureComponent = q, it.StrictMode = r, it.Suspense = S, it.ViewTransition = b, it.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = L, it.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(A) {
      return L.H.useMemoCache(A);
    }
  }, it.addTransitionType = xn, it.cache = function(A) {
    return function() {
      return A.apply(null, arguments);
    };
  }, it.cacheSignal = function() {
    return null;
  }, it.cloneElement = function(A, H, $) {
    if (A == null)
      throw Error(
        "The argument must be a React element, but you passed " + A + "."
      );
    var tt = V({}, A.props), vt = A.key;
    if (H != null)
      for (St in H.key !== void 0 && (vt = "" + H.key), H)
        !pt.call(H, St) || St === "key" || St === "__self" || St === "__source" || St === "ref" && H.ref === void 0 || (tt[St] = H[St]);
    var St = arguments.length - 2;
    if (St === 1) tt.children = $;
    else if (1 < St) {
      for (var Et = Array(St), F = 0; F < St; F++)
        Et[F] = arguments[F + 2];
      tt.children = Et;
    }
    return rt(A.type, vt, tt);
  }, it.createContext = function(A) {
    return A = {
      $$typeof: h,
      _currentValue: A,
      _currentValue2: A,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, A.Provider = A, A.Consumer = {
      $$typeof: d,
      _context: A
    }, A;
  }, it.createElement = function(A, H, $) {
    var tt, vt = {}, St = null;
    if (H != null)
      for (tt in H.key !== void 0 && (St = "" + H.key), H)
        pt.call(H, tt) && tt !== "key" && tt !== "__self" && tt !== "__source" && (vt[tt] = H[tt]);
    var Et = arguments.length - 2;
    if (Et === 1) vt.children = $;
    else if (1 < Et) {
      for (var F = Array(Et), nt = 0; nt < Et; nt++)
        F[nt] = arguments[nt + 2];
      vt.children = F;
    }
    if (A && A.defaultProps)
      for (tt in Et = A.defaultProps, Et)
        vt[tt] === void 0 && (vt[tt] = Et[tt]);
    return rt(A, St, vt);
  }, it.createRef = function() {
    return { current: null };
  }, it.forwardRef = function(A) {
    return { $$typeof: m, render: A };
  }, it.isValidElement = Ht, it.lazy = function(A) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: A },
      _init: mt
    };
  }, it.memo = function(A, H) {
    return {
      $$typeof: p,
      type: A,
      compare: H === void 0 ? null : H
    };
  }, it.startTransition = Te, it.unstable_useCacheRefresh = function() {
    return L.H.useCacheRefresh();
  }, it.use = function(A) {
    return L.H.use(A);
  }, it.useActionState = function(A, H, $) {
    return L.H.useActionState(A, H, $);
  }, it.useCallback = function(A, H) {
    return L.H.useCallback(A, H);
  }, it.useContext = function(A) {
    return L.H.useContext(A);
  }, it.useDebugValue = function() {
  }, it.useDeferredValue = function(A, H) {
    return L.H.useDeferredValue(A, H);
  }, it.useEffect = function(A, H) {
    return L.H.useEffect(A, H);
  }, it.useEffectEvent = function(A) {
    return L.H.useEffectEvent(A);
  }, it.useId = function() {
    return L.H.useId();
  }, it.useImperativeHandle = function(A, H, $) {
    return L.H.useImperativeHandle(A, H, $);
  }, it.useInsertionEffect = function(A, H) {
    return L.H.useInsertionEffect(A, H);
  }, it.useLayoutEffect = function(A, H) {
    return L.H.useLayoutEffect(A, H);
  }, it.useMemo = function(A, H) {
    return L.H.useMemo(A, H);
  }, it.useOptimistic = function(A, H) {
    return L.H.useOptimistic(A, H);
  }, it.useReducer = function(A, H, $) {
    return L.H.useReducer(A, H, $);
  }, it.useRef = function(A) {
    return L.H.useRef(A);
  }, it.useState = function(A) {
    return L.H.useState(A);
  }, it.useSyncExternalStore = function(A, H, $) {
    return L.H.useSyncExternalStore(
      A,
      H,
      $
    );
  }, it.useTransition = function() {
    return L.H.useTransition();
  }, it.version = "19.3.0", it;
}
var c0;
function $f() {
  return c0 || (c0 = 1, rf.exports = zb()), rf.exports;
}
var cf = { exports: {} }, re = {};
var f0;
function Rb() {
  if (f0) return re;
  f0 = 1;
  var a = $f();
  function l(v) {
    var g = "https://react.dev/errors/" + v;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        g += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + v + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var r = {
    d: {
      f: o,
      r: function() {
        throw Error(l(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, c = /* @__PURE__ */ Symbol.for("react.portal"), d = /* @__PURE__ */ Symbol.for("react.recoverable"), h = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function m(v, g, b) {
    var _ = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: _ == null ? null : _ === h ? h : "" + _,
      children: v,
      containerInfo: g,
      implementation: b
    };
  }
  var S = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function p(v, g) {
    if (v === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return re.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, re.browser = function(v) {
    return { $$typeof: d, _reason: v };
  }, re.createPortal = function(v, g) {
    var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(l(299));
    return m(v, g, null, b);
  }, re.flushSync = function(v) {
    var g = S.T, b = r.p;
    try {
      if (S.T = null, r.p = 2, v) return v();
    } finally {
      S.T = g, r.p = b, r.d.f();
    }
  }, re.preconnect = function(v, g) {
    typeof v == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, r.d.C(v, g));
  }, re.prefetchDNS = function(v) {
    typeof v == "string" && r.d.D(v);
  }, re.preinit = function(v, g) {
    if (typeof v == "string" && g && typeof g.as == "string") {
      var b = g.as, _ = p(b, g.crossOrigin), R = typeof g.integrity == "string" ? g.integrity : void 0, B = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      b === "style" ? r.d.S(
        v,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: _,
          integrity: R,
          fetchPriority: B
        }
      ) : b === "script" && r.d.X(v, {
        crossOrigin: _,
        integrity: R,
        fetchPriority: B,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, re.preinitModule = function(v, g) {
    if (typeof v == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var b = p(
            g.as,
            g.crossOrigin
          );
          r.d.M(v, {
            crossOrigin: b,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0,
            fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
          });
        }
      } else g == null && r.d.M(v);
  }, re.preload = function(v, g) {
    if (typeof v == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var b = g.as, _ = p(b, g.crossOrigin);
      r.d.L(v, b, {
        crossOrigin: _,
        integrity: typeof g.integrity == "string" ? g.integrity : void 0,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0,
        type: typeof g.type == "string" ? g.type : void 0,
        fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
        referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
        imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
        imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
        media: typeof g.media == "string" ? g.media : void 0
      });
    }
  }, re.preloadModule = function(v, g) {
    if (typeof v == "string")
      if (g) {
        var b = p(g.as, g.crossOrigin);
        r.d.m(v, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: b,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0,
          nonce: typeof g.nonce == "string" ? g.nonce : void 0,
          fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
        });
      } else r.d.m(v);
  }, re.requestFormReset = function(v) {
    r.d.r(v);
  }, re.unstable_batchedUpdates = function(v, g) {
    return v(g);
  }, re.useFormState = function(v, g, b) {
    return S.H.useFormState(v, g, b);
  }, re.useFormStatus = function() {
    return S.H.useHostTransitionStatus();
  }, re.version = "19.3.0", re;
}
var h0;
function _b() {
  if (h0) return cf.exports;
  h0 = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return a(), cf.exports = Rb(), cf.exports;
}
var d0;
function Nb() {
  if (d0) return kl;
  d0 = 1;
  var a = Ob(), l = $f(), o = _b();
  function r(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function d(t) {
    for (var e = t, n = e; n && !n.alternate; )
      e = n, (e.flags & 4098) !== 0 && (t = e.return), n = e.return;
    for (; e.return; ) e = e.return;
    return e.tag === 3 ? t : null;
  }
  function h(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function m(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function S(t) {
    if (d(t) !== t)
      throw Error(r(188));
  }
  function p(t) {
    var e = t.alternate;
    if (!e) {
      if (e = d(t), e === null) throw Error(r(188));
      return e !== t ? null : t;
    }
    for (var n = t, i = e; ; ) {
      var u = n.return;
      if (u === null) break;
      var s = u.alternate;
      if (s === null) {
        if (i = u.return, i !== null) {
          n = i;
          continue;
        }
        break;
      }
      if (u.child === s.child) {
        for (s = u.child; s; ) {
          if (s === n) return S(u), t;
          if (s === i) return S(u), e;
          s = s.sibling;
        }
        throw Error(r(188));
      }
      if (n.return !== i.return) n = u, i = s;
      else {
        for (var f = !1, y = u.child; y; ) {
          if (y === n) {
            f = !0, n = u, i = s;
            break;
          }
          if (y === i) {
            f = !0, i = u, n = s;
            break;
          }
          y = y.sibling;
        }
        if (!f) {
          for (y = s.child; y; ) {
            if (y === n) {
              f = !0, n = s, i = u;
              break;
            }
            if (y === i) {
              f = !0, i = s, n = u;
              break;
            }
            y = y.sibling;
          }
          if (!f) throw Error(r(189));
        }
      }
      if (n.alternate !== i) throw Error(r(190));
    }
    if (n.tag !== 3) throw Error(r(188));
    return n.stateNode.current === n ? t : e;
  }
  function v(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = v(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  function g(t, e, n, i, u, s) {
    for (; t !== null; ) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && n(t, i, u, s) || (t.tag !== 22 || t.memoizedState === null) && (e || t.tag !== 5 && t.tag !== 27) && g(
        t.child,
        e,
        n,
        i,
        u,
        s
      ))
        return !0;
      t = t.sibling;
    }
    return !1;
  }
  function b(t) {
    for (t = t.return; t !== null; ) {
      if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
      t = t.return;
    }
    return null;
  }
  function _(t) {
    var e = !1;
    for (t = t.return; t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
      t = t.return;
    return e;
  }
  function R(t) {
    var e = [null, null], n = b(t);
    return n === null || B(
      e,
      t,
      n.child,
      { foundSelf: !1 }
    ), e;
  }
  function B(t, e, n, i) {
    for (; n !== null; ) {
      if (n === e) i.foundSelf = !0;
      else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
        if (i.foundSelf) return t[1] = n, !0;
        t[0] = n;
      } else if ((n.tag !== 22 || n.memoizedState === null) && B(
        t,
        e,
        n.child,
        i
      ))
        return !0;
      n = n.sibling;
    }
    return !1;
  }
  function V(t) {
    switch (t.tag) {
      case 5:
      case 27:
      case 6:
        return t.stateNode;
      case 3:
        return t.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var Q = null, Y = null;
  function Z(t, e, n) {
    return t === n ? !0 : t === e ? (Q = t, !0) : !1;
  }
  function q(t, e, n) {
    return t === n ? (Y = t, !1) : t === e ? (Y !== null && (Q = t), !0) : !1;
  }
  function at(t) {
    if (t === null) return null;
    do
      t = t === null ? null : t.return;
    while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
    return t || null;
  }
  function ot(t, e, n) {
    for (var i = 0, u = t; u; u = n(u)) i++;
    u = 0;
    for (var s = e; s; s = n(s)) u++;
    for (; 0 < i - u; ) t = n(t), i--;
    for (; 0 < u - i; ) e = n(e), u--;
    for (; i--; ) {
      if (t === e || e !== null && t === e.alternate)
        return t;
      t = n(t), e = n(e);
    }
    return null;
  }
  var w = Object.assign, L = /* @__PURE__ */ Symbol.for("react.element"), pt = /* @__PURE__ */ Symbol.for("react.transitional.element"), rt = /* @__PURE__ */ Symbol.for("react.portal"), Yt = /* @__PURE__ */ Symbol.for("react.fragment"), Ht = /* @__PURE__ */ Symbol.for("react.strict_mode"), Lt = /* @__PURE__ */ Symbol.for("react.profiler"), Se = /* @__PURE__ */ Symbol.for("react.consumer"), wt = /* @__PURE__ */ Symbol.for("react.context"), G = /* @__PURE__ */ Symbol.for("react.forward_ref"), K = /* @__PURE__ */ Symbol.for("react.suspense"), k = /* @__PURE__ */ Symbol.for("react.suspense_list"), mt = /* @__PURE__ */ Symbol.for("react.memo"), yt = /* @__PURE__ */ Symbol.for("react.lazy"), Te = /* @__PURE__ */ Symbol.for("react.activity"), xn = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), Ei = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), A = /* @__PURE__ */ Symbol.for("react.view_transition"), H = /* @__PURE__ */ Symbol.for("react.recoverable"), $ = Symbol.iterator;
  function tt(t) {
    return t === null || typeof t != "object" ? null : (t = $ && t[$] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var vt = /* @__PURE__ */ Symbol.for("react.client.reference");
  function St(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === vt ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case Yt:
        return "Fragment";
      case Lt:
        return "Profiler";
      case Ht:
        return "StrictMode";
      case K:
        return "Suspense";
      case k:
        return "SuspenseList";
      case Te:
        return "Activity";
      case A:
        return "ViewTransition";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case rt:
          return "Portal";
        case wt:
          return t.displayName || "Context";
        case Se:
          return (t._context.displayName || "Context") + ".Consumer";
        case G:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case mt:
          return e = t.displayName || null, e !== null ? e : St(t.type) || "Memo";
        case yt:
          e = t._payload, t = t._init;
          try {
            return St(t(e));
          } catch {
          }
      }
    return null;
  }
  var Et = Array.isArray, F = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, nt = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Cn = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Ao = [], $i = -1;
  function on(t) {
    return { current: t };
  }
  function ne(t) {
    0 > $i || (t.current = Ao[$i], Ao[$i] = null, $i--);
  }
  function _t(t, e) {
    $i++, Ao[$i] = t.current, t.current = e;
  }
  var rn = on(null), el = on(null), Zn = on(null), du = on(null);
  function mu(t, e) {
    switch (_t(Zn, e), _t(el, t), _t(rn, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? mg(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = mg(e), t = yg(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    ne(rn), _t(rn, t);
  }
  function ta() {
    ne(rn), ne(el), ne(Zn);
  }
  function Do(t) {
    var e = t.memoizedState;
    e !== null && (Ga._currentValue = e.memoizedState, _t(du, t)), e = rn.current;
    var n = yg(e, t.type);
    e !== n && (_t(el, t), _t(rn, n));
  }
  function yu(t) {
    el.current === t && (ne(rn), ne(el)), du.current === t && (ne(du), Ga._currentValue = Cn);
  }
  var Mo, wh;
  function Kn(t) {
    if (Mo === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        Mo = e && e[1] || "", wh = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Mo + t + wh;
  }
  var xo = !1;
  function Co(t, e) {
    if (!t || xo) return "";
    xo = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var U = function() {
                throw Error();
              };
              if (Object.defineProperty(U.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(U, []);
                } catch (j) {
                  var D = j;
                }
                Reflect.construct(t, [], U);
              } else {
                try {
                  U.call();
                } catch (j) {
                  D = j;
                }
                U = !1;
                try {
                  var O = Object.getOwnPropertyDescriptor(
                    t.prototype,
                    "props"
                  );
                  Object.defineProperty(t.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), U = !0, new t();
                } finally {
                  U && (O !== void 0 ? Object.defineProperty(t.prototype, "props", O) : delete t.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (j) {
                D = j;
              }
              (U = t()) && typeof U.catch == "function" && U.catch(function() {
              });
            }
          } catch (j) {
            if (j && D && typeof j.stack == "string")
              return [j.stack, D.stack];
          }
          return [null, null];
        }
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        i.DetermineComponentFrameRoot,
        "name"
      );
      u && u.configurable && Object.defineProperty(
        i.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var s = i.DetermineComponentFrameRoot(), f = s[0], y = s[1];
      if (f && y) {
        var T = f.split(`
`), x = y.split(`
`);
        for (u = i = 0; i < T.length && !T[i].includes("DetermineComponentFrameRoot"); )
          i++;
        for (; u < x.length && !x[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (i === T.length || u === x.length)
          for (i = T.length - 1, u = x.length - 1; 1 <= i && 0 <= u && T[i] !== x[u]; )
            u--;
        for (; 1 <= i && 0 <= u; i--, u--)
          if (T[i] !== x[u]) {
            if (i !== 1 || u !== 1)
              do
                if (i--, u--, 0 > u || T[i] !== x[u]) {
                  var z = `
` + T[i].replace(" at new ", " at ");
                  return t.displayName && z.includes("<anonymous>") && (z = z.replace("<anonymous>", t.displayName)), z;
                }
              while (1 <= i && 0 <= u);
            break;
          }
      }
    } finally {
      xo = !1, Error.prepareStackTrace = n;
    }
    return (n = t ? t.displayName || t.name : "") ? Kn(n) : "";
  }
  function z1(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Kn(t.type);
      case 16:
        return Kn("Lazy");
      case 13:
        return t.child !== e && e !== null ? Kn("Suspense Fallback") : Kn("Suspense");
      case 19:
        return Kn("SuspenseList");
      case 0:
      case 15:
        return Co(t.type, !1);
      case 11:
        return Co(t.type.render, !1);
      case 1:
        return Co(t.type, !0);
      case 31:
        return Kn("Activity");
      case 30:
        return Kn("ViewTransition");
      default:
        return "";
    }
  }
  function Bh(t) {
    try {
      var e = "", n = null;
      do
        e += z1(t, n), n = t, t = t.return;
      while (t);
      return e;
    } catch (i) {
      return `
Error generating stack: ` + i.message + `
` + i.stack;
    }
  }
  var Oo = Object.prototype.hasOwnProperty, zo = a.unstable_scheduleCallback, Ro = a.unstable_cancelCallback, R1 = a.unstable_shouldYield, _1 = a.unstable_requestPaint, Ce = a.unstable_now, N1 = a.unstable_getCurrentPriorityLevel, Hh = a.unstable_ImmediatePriority, Lh = a.unstable_UserBlockingPriority, gu = a.unstable_NormalPriority, V1 = a.unstable_LowPriority, jh = a.unstable_IdlePriority, U1 = a.log, w1 = a.unstable_setDisableYieldValue, nl = null, Oe = null;
  function Jn(t) {
    if (typeof U1 == "function" && w1(t), Oe && typeof Oe.setStrictMode == "function")
      try {
        Oe.setStrictMode(nl, t);
      } catch {
      }
  }
  var ze = Math.clz32 ? Math.clz32 : L1, B1 = Math.log, H1 = Math.LN2;
  function L1(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (B1(t) / H1 | 0) | 0;
  }
  var vu = 256, pu = 262144, Su = 4194304;
  function Ai(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & -t;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Tu(t, e, n) {
    var i = t.pendingLanes;
    if (i === 0) return 0;
    var u = 0, s = t.suspendedLanes, f = t.pingedLanes;
    t = t.warmLanes;
    var y = i & 134217727;
    return y !== 0 ? (i = y & ~s, i !== 0 ? u = Ai(i) : (f &= y, f !== 0 ? u = Ai(f) : n || (n = y & ~t, n !== 0 && (u = Ai(n))))) : (y = i & ~s, y !== 0 ? u = Ai(y) : f !== 0 ? u = Ai(f) : n || (n = i & ~t, n !== 0 && (u = Ai(n)))), u === 0 ? 0 : e !== 0 && e !== u && (e & s) === 0 && (s = u & -u, n = e & -e, s >= n || s === 32 && (n & 4194048) !== 0) ? e : u;
  }
  function il(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Yh(t, e) {
    (e & 8) !== 0 && (e |= e & 32);
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var i = 31 - ze(n), u = 1 << i;
        e |= t[i], n &= ~u;
      }
    return e;
  }
  function j1(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Gh() {
    var t = Su;
    return Su <<= 1, (Su & 62914560) === 0 && (Su = 4194304), t;
  }
  function _o(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function al(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function Y1(t, e, n, i, u, s) {
    var f = t.pendingLanes;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
    var y = t.entanglements, T = t.expirationTimes, x = t.hiddenUpdates;
    for (n = f & ~n; 0 < n; ) {
      var z = 31 - ze(n), U = 1 << z;
      y[z] = 0, T[z] = -1;
      var D = x[z];
      if (D !== null)
        for (x[z] = null, z = 0; z < D.length; z++) {
          var O = D[z];
          O !== null && (O.lane &= -536870913);
        }
      n &= ~U;
    }
    i !== 0 && qh(t, i, 0), s !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= s & ~(f & ~e));
  }
  function qh(t, e, n) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var i = 31 - ze(e);
    t.entangledLanes |= e, t.entanglements[i] = t.entanglements[i] | 1073741824 | n & 261930;
  }
  function Xh(t, e) {
    var n = t.entangledLanes |= e;
    for (t = t.entanglements; n; ) {
      var i = 31 - ze(n), u = 1 << i;
      u & e | t[i] & e && (t[i] |= e), n &= ~u;
    }
  }
  function Qh(t, e) {
    var n = e & -e;
    return n = (n & 42) !== 0 ? 1 : No(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n;
  }
  function No(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Vo(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Zh() {
    var t = nt.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : Ig(t.type));
  }
  function Kh(t, e) {
    var n = nt.p;
    try {
      return nt.p = t, e();
    } finally {
      nt.p = n;
    }
  }
  var On = Math.random().toString(36).slice(2), ie = "__reactFiber$" + On, be = "__reactProps$" + On, ea = "__reactContainer$" + On, Jh = "__reactEvents$" + On, G1 = "__reactListeners$" + On, q1 = "__reactHandles$" + On, Ph = "__reactResources$" + On, ll = "__reactMarker$" + On, bu = "__reactLoad$" + On;
  function Eu(t) {
    delete t[ie], delete t[be], delete t[G1], delete t[q1];
  }
  function Di(t) {
    var e;
    if (e = t[ie]) return e;
    for (var n = t.parentNode; n; ) {
      if (e = n[ea] || n[ie]) {
        if (n = e.alternate, e.child !== null || n !== null && n.child !== null)
          for (t = Ng(t); t !== null; ) {
            if (n = t[ie]) return n;
            t = Ng(t);
          }
        return e;
      }
      t = n, n = t.parentNode;
    }
    return null;
  }
  function na(t) {
    if (t = t[ie] || t[ea]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function ul(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(r(33));
  }
  function ia(t) {
    var e = t[Ph];
    return e || (e = t[Ph] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function It(t) {
    t[ll] = !0;
  }
  function Fh(t) {
    t[bu] = void 0;
  }
  var kh = /* @__PURE__ */ new Set(), Wh = {};
  function Mi(t, e) {
    aa(t, e), aa(t + "Capture", e);
  }
  function aa(t, e) {
    for (Wh[t] = e, t = 0; t < e.length; t++)
      kh.add(e[t]);
  }
  var X1 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ih = {}, $h = {};
  function Q1(t) {
    return Oo.call($h, t) ? !0 : Oo.call(Ih, t) ? !1 : X1.test(t) ? $h[t] = !0 : (Ih[t] = !0, !1);
  }
  var Tt = !1;
  function td() {
    var t = Tt;
    return Tt = !1, t;
  }
  function Au(t, e, n) {
    if (Q1(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var i = e.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, n);
      }
  }
  function Du(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, n);
    }
  }
  function zn(t, e, n, i) {
    if (i === null) t.removeAttribute(n);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, i);
    }
  }
  function Re(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function ed(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function Z1(t, e, n) {
    var i = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
      var u = i.get, s = i.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return u.call(this);
        },
        set: function(f) {
          n = "" + f, s.call(this, f);
        }
      }), Object.defineProperty(t, e, {
        enumerable: i.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(f) {
          n = "" + f;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Uo(t) {
    if (!t._valueTracker) {
      var e = ed(t) ? "checked" : "value";
      t._valueTracker = Z1(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function nd(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(), i = "";
    return t && (i = ed(t) ? t.checked ? "true" : "false" : t.value), t = i, t !== n ? (e.setValue(t), !0) : !1;
  }
  var K1 = /[\n"\\]/g;
  function Ye(t) {
    return t.replace(
      K1,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function wo(t, e, n, i, u, s, f, y) {
    t.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? t.type = f : t.removeAttribute("type"), e != null ? f === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Re(e)) : t.value !== "" + Re(e) && (t.value = "" + Re(e)) : f !== "submit" && f !== "reset" || t.removeAttribute("value"), e != null ? f === "number" && t.value == e ? Bo(t, Re(t.value)) : Bo(t, Re(e)) : n != null ? Bo(t, Re(n)) : i != null && t.removeAttribute("value"), u == null && s != null && (t.defaultChecked = !!s), u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"), y != null && typeof y != "function" && typeof y != "symbol" && typeof y != "boolean" ? t.name = "" + Re(y) : t.removeAttribute("name");
  }
  function id(t, e, n, i, u, s, f, y) {
    if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (t.type = s), e != null || n != null) {
      if (!(s !== "submit" && s !== "reset" || e != null)) {
        Uo(t);
        return;
      }
      n = n != null ? "" + Re(n) : "", e = e != null ? "" + Re(e) : n, y || e === t.value || (t.value = e), t.defaultValue = e;
    }
    i = i ?? u, i = typeof i != "function" && typeof i != "symbol" && !!i, t.checked = y ? t.checked : !!i, t.defaultChecked = !!i, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (t.name = f), Uo(t);
  }
  function Bo(t, e) {
    t.defaultValue !== "" + e && (t.defaultValue = "" + e);
  }
  function la(t, e, n, i) {
    if (t = t.options, e) {
      e = {};
      for (var u = 0; u < n.length; u++)
        e["$" + n[u]] = !0;
      for (n = 0; n < t.length; n++)
        u = e.hasOwnProperty("$" + t[n].value), t[n].selected !== u && (t[n].selected = u), u && i && (t[n].defaultSelected = !0);
    } else {
      for (n = "" + Re(n), e = null, u = 0; u < t.length; u++) {
        if (t[u].value === n) {
          t[u].selected = !0, i && (t[u].defaultSelected = !0);
          return;
        }
        e !== null || t[u].disabled || (e = t[u]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function ad(t, e, n) {
    if (e != null && (e = "" + Re(e), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + Re(n) : "";
  }
  function ld(t, e, n, i) {
    if (e == null) {
      if (i != null) {
        if (n != null) throw Error(r(92));
        if (Et(i)) {
          if (1 < i.length) throw Error(r(93));
          i = i[0];
        }
        n = i;
      }
      n == null && (n = ""), e = n;
    }
    n = Re(e), t.defaultValue = n, i = t.textContent, i === n && i !== "" && i !== null && (t.value = i), Uo(t);
  }
  function ua(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var J1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function ud(t, e, n) {
    var i = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? i ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : i ? t.setProperty(e, n) : typeof n != "number" || n === 0 || J1.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
  }
  function sd(t, e, n) {
    if (e != null && typeof e != "object")
      throw Error(r(62));
    if (t = t.style, n != null) {
      for (var i in n)
        !n.hasOwnProperty(i) || e != null && e.hasOwnProperty(i) || (i.indexOf("--") === 0 ? t.setProperty(i, "") : i === "float" ? t.cssFloat = "" : t[i] = "", Tt = !0);
      for (var u in e)
        i = e[u], e.hasOwnProperty(u) && n[u] !== i && (ud(t, u, i), Tt = !0);
    } else
      for (var s in e)
        e.hasOwnProperty(s) && ud(t, s, e[s]);
  }
  function Ho(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var P1 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), F1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Mu(t) {
    return F1.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function cn() {
  }
  var Lo = null;
  function jo(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var sa = null, oa = null;
  function od(t) {
    var e = na(t);
    if (e && (t = e.stateNode)) {
      var n = t[be] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (wo(
            t,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), e = n.name, n.type === "radio" && e != null) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + Ye(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < n.length; e++) {
              var i = n[e];
              if (i !== t && i.form === t.form) {
                var u = i[be] || null;
                if (!u) throw Error(r(90));
                wo(
                  i,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (e = 0; e < n.length; e++)
              i = n[e], i.form === t.form && nd(i);
          }
          break t;
        case "textarea":
          ad(t, n.value, n.defaultValue);
          break t;
        case "select":
          e = n.value, e != null && la(t, !!n.multiple, e, !1);
      }
    }
  }
  var Yo = !1;
  function rd(t, e, n) {
    if (Yo) return t(e, n);
    Yo = !0;
    try {
      var i = t(e);
      return i;
    } finally {
      if (Yo = !1, (sa !== null || oa !== null) && (Ms(), sa && (e = sa, t = oa, oa = sa = null, od(e), t)))
        for (e = 0; e < t.length; e++) od(t[e]);
    }
  }
  function sl(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var i = n[be] || null;
    if (i === null) return null;
    n = i[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (i = !i.disabled) || (t = t.type, i = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !i;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function")
      throw Error(
        r(231, e, typeof n)
      );
    return n;
  }
  var Rn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Go = !1;
  if (Rn)
    try {
      var ol = {};
      Object.defineProperty(ol, "passive", {
        get: function() {
          Go = !0;
        }
      }), window.addEventListener("test", ol, ol), window.removeEventListener("test", ol, ol);
    } catch {
      Go = !1;
    }
  var Pn = null, qo = null, xu = null;
  function cd() {
    if (xu) return xu;
    var t, e = qo, n = e.length, i, u = "value" in Pn ? Pn.value : Pn.textContent, s = u.length;
    for (t = 0; t < n && e[t] === u[t]; t++) ;
    var f = n - t;
    for (i = 1; i <= f && e[n - i] === u[s - i]; i++) ;
    return xu = u.slice(t, 1 < i ? 1 - i : void 0);
  }
  function Cu(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Ou() {
    return !0;
  }
  function fd() {
    return !1;
  }
  function me(t) {
    function e(n, i, u, s, f) {
      this._reactName = n, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
      for (var y in t)
        t.hasOwnProperty(y) && (n = t[y], this[y] = n ? n(s) : s[y]);
      return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? Ou : fd, this.isPropagationStopped = fd, this;
    }
    return w(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Ou);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Ou);
      },
      persist: function() {
      },
      isPersistent: Ou
    }), e;
  }
  var Fn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, zu = me(Fn), rl = w({}, Fn, { view: 0, detail: 0 }), k1 = me(rl), Xo, Qo, cl, Ru = w({}, rl, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Ko,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== cl && (cl && t.type === "mousemove" ? (Xo = t.screenX - cl.screenX, Qo = t.screenY - cl.screenY) : Qo = Xo = 0, cl = t), Xo);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Qo;
    }
  }), hd = me(Ru), W1 = w({}, Ru, { dataTransfer: 0 }), I1 = me(W1), $1 = w({}, rl, { relatedTarget: 0 }), Zo = me($1), tS = w({}, Fn, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), eS = me(tS), nS = w({}, Fn, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), iS = me(nS), aS = w({}, Fn, { data: 0 }), dd = me(aS), lS = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, uS = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, sS = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function oS(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = sS[t]) ? !!e[t] : !1;
  }
  function Ko() {
    return oS;
  }
  var rS = w({}, rl, {
    key: function(t) {
      if (t.key) {
        var e = lS[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = Cu(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? uS[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Ko,
    charCode: function(t) {
      return t.type === "keypress" ? Cu(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? Cu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), cS = me(rS), fS = w({}, Ru, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), md = me(fS), hS = w({}, Fn, { submitter: 0 }), dS = me(hS), mS = w({}, rl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Ko
  }), yS = me(mS), gS = w({}, Fn, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), vS = me(gS), pS = w({}, Ru, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), SS = me(pS), TS = w({}, Fn, {
    newState: 0,
    oldState: 0,
    source: 0
  }), bS = me(TS), ES = [9, 13, 27, 32], Jo = Rn && "CompositionEvent" in window, fl = null;
  Rn && "documentMode" in document && (fl = document.documentMode);
  var AS = Rn && "TextEvent" in window && !fl, yd = Rn && (!Jo || fl && 8 < fl && 11 >= fl), gd = " ", vd = !1;
  function pd(t, e) {
    switch (t) {
      case "keyup":
        return ES.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Sd(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var ra = !1;
  function DS(t, e) {
    switch (t) {
      case "compositionend":
        return Sd(e);
      case "keypress":
        return e.which !== 32 ? null : (vd = !0, gd);
      case "textInput":
        return t = e.data, t === gd && vd ? null : t;
      default:
        return null;
    }
  }
  function MS(t, e) {
    if (ra)
      return t === "compositionend" || !Jo && pd(t, e) ? (t = cd(), xu = qo = Pn = null, ra = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return yd && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var xS = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Td(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!xS[t.type] : e === "textarea";
  }
  function bd(t, e, n, i) {
    sa ? oa ? oa.push(i) : oa = [i] : sa = i, e = _s(e, "onChange"), 0 < e.length && (n = new zu(
      "onChange",
      "change",
      null,
      n,
      i
    ), t.push({ event: n, listeners: e }));
  }
  var hl = null, dl = null;
  function CS(t) {
    og(t, 0);
  }
  function _u(t) {
    var e = ul(t);
    if (nd(e)) return t;
  }
  function Ed(t, e) {
    if (t === "change") return e;
  }
  var Ad = !1;
  if (Rn) {
    var Po;
    if (Rn) {
      var Fo = "oninput" in document;
      if (!Fo) {
        var Dd = document.createElement("div");
        Dd.setAttribute("oninput", "return;"), Fo = typeof Dd.oninput == "function";
      }
      Po = Fo;
    } else Po = !1;
    Ad = Po && (!document.documentMode || 9 < document.documentMode);
  }
  function Md() {
    hl && (hl.detachEvent("onpropertychange", xd), dl = hl = null);
  }
  function xd(t) {
    if (t.propertyName === "value" && _u(dl)) {
      var e = [];
      bd(
        e,
        dl,
        t,
        jo(t)
      ), rd(CS, e);
    }
  }
  function OS(t, e, n) {
    t === "focusin" ? (Md(), hl = e, dl = n, hl.attachEvent("onpropertychange", xd)) : t === "focusout" && Md();
  }
  function zS(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return _u(dl);
  }
  function RS(t, e) {
    if (t === "click") return _u(e);
  }
  function _S(t, e) {
    if (t === "input" || t === "change")
      return _u(e);
  }
  function NS(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var _e = typeof Object.is == "function" ? Object.is : NS;
  function ml(t, e) {
    if (_e(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var n = Object.keys(t), i = Object.keys(e);
    if (n.length !== i.length) return !1;
    for (i = 0; i < n.length; i++) {
      var u = n[i];
      if (!Oo.call(e, u) || !_e(t[u], e[u]))
        return !1;
    }
    return !0;
  }
  function ko(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function Cd(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Od(t, e) {
    var n = Cd(t);
    t = 0;
    for (var i; n; ) {
      if (n.nodeType === 3) {
        if (i = t + n.textContent.length, t <= e && i >= e)
          return { node: n, offset: e - t };
        t = i;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Cd(n);
    }
  }
  function zd(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? zd(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function Rd(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = ko(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = ko(t.document);
    }
    return e;
  }
  function Wo(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var VS = Rn && "documentMode" in document && 11 >= document.documentMode, ca = null, Io = null, yl = null, $o = !1;
  function _d(t, e, n) {
    var i = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    $o || ca == null || ca !== ko(i) || (i = ca, "selectionStart" in i && Wo(i) ? i = { start: i.selectionStart, end: i.selectionEnd } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
      anchorNode: i.anchorNode,
      anchorOffset: i.anchorOffset,
      focusNode: i.focusNode,
      focusOffset: i.focusOffset
    }), yl && ml(yl, i) || (yl = i, i = _s(Io, "onSelect"), 0 < i.length && (e = new zu(
      "onSelect",
      "select",
      null,
      e,
      n
    ), t.push({ event: e, listeners: i }), e.target = ca)));
  }
  function xi(t, e) {
    var n = {};
    return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
  }
  var fa = {
    animationend: xi("Animation", "AnimationEnd"),
    animationiteration: xi("Animation", "AnimationIteration"),
    animationstart: xi("Animation", "AnimationStart"),
    transitionrun: xi("Transition", "TransitionRun"),
    transitionstart: xi("Transition", "TransitionStart"),
    transitioncancel: xi("Transition", "TransitionCancel"),
    transitionend: xi("Transition", "TransitionEnd")
  }, tr = {}, Nd = {};
  Rn && (Nd = document.createElement("div").style, "AnimationEvent" in window || (delete fa.animationend.animation, delete fa.animationiteration.animation, delete fa.animationstart.animation), "TransitionEvent" in window || delete fa.transitionend.transition);
  function Ci(t) {
    if (tr[t]) return tr[t];
    if (!fa[t]) return t;
    var e = fa[t], n;
    for (n in e)
      if (e.hasOwnProperty(n) && n in Nd)
        return tr[t] = e[n];
    return t;
  }
  var Vd = Ci("animationend"), Ud = Ci("animationiteration"), wd = Ci("animationstart"), US = Ci("transitionrun"), wS = Ci("transitionstart"), BS = Ci("transitioncancel"), Bd = Ci("transitionend"), Hd = /* @__PURE__ */ new Map(), er = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  er.push("scrollEnd");
  function We(t, e) {
    Hd.set(t, e), Mi(e, [t]);
  }
  var HS = 0;
  function _n(t, e) {
    if (t.name != null && t.name !== "auto") return t.name;
    if (e.autoName !== null) return e.autoName;
    t = en.identifierPrefix;
    var n = HS++;
    return t = "_" + t + "t_" + n.toString(32) + "_", e.autoName = t;
  }
  function Ld(t) {
    if (t == null || typeof t == "string")
      return t;
    var e = null, n = _a;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var u = t[n[i]];
        if (u != null) {
          if (u === "none") return "none";
          e = e == null ? u : e + (" " + u);
        }
      }
    return e ?? t.default;
  }
  function Nn(t, e) {
    return t = Ld(t), e = Ld(e), e == null ? t === "auto" ? null : t : e === "auto" ? null : e;
  }
  var Nu = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, Ge = [], ha = 0, nr = 0;
  function Vu() {
    for (var t = ha, e = nr = ha = 0; e < t; ) {
      var n = Ge[e];
      Ge[e++] = null;
      var i = Ge[e];
      Ge[e++] = null;
      var u = Ge[e];
      Ge[e++] = null;
      var s = Ge[e];
      if (Ge[e++] = null, i !== null && u !== null) {
        var f = i.pending;
        f === null ? u.next = u : (u.next = f.next, f.next = u), i.pending = u;
      }
      s !== 0 && jd(n, u, s);
    }
  }
  function Uu(t, e, n, i) {
    Ge[ha++] = t, Ge[ha++] = e, Ge[ha++] = n, Ge[ha++] = i, nr |= i, t.lanes |= i, t = t.alternate, t !== null && (t.lanes |= i);
  }
  function ir(t, e, n, i) {
    return Uu(t, e, n, i), wu(t);
  }
  function Oi(t, e) {
    return Uu(t, null, null, e), wu(t);
  }
  function jd(t, e, n) {
    t.lanes |= n;
    var i = t.alternate;
    i !== null && (i.lanes |= n);
    for (var u = !1, s = t.return; s !== null; )
      s.childLanes |= n, i = s.alternate, i !== null && (i.childLanes |= n), s.tag === 22 && (t = s.stateNode, t === null || t._visibility & 1 || (u = !0)), t = s, s = s.return;
    return t.tag === 3 ? (s = t.stateNode, u && e !== null && (u = 31 - ze(n), t = s.hiddenUpdates, i = t[u], i === null ? t[u] = [e] : i.push(e), e.lane = n | 536870912), s) : null;
  }
  function wu(t) {
    if (50 < Hl)
      throw Hl = 0, Ds = null, Error(r(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var da = {};
  function LS(t, e, n, i) {
    this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ee(t, e, n, i) {
    return new LS(t, e, n, i);
  }
  function ar(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Vn(t, e) {
    var n = t.alternate;
    return n === null ? (n = Ee(
      t.tag,
      e,
      t.key,
      t.mode
    ), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 1206910976, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
  }
  function Yd(t, e) {
    t.flags &= 1206910978;
    var n = t.alternate;
    return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function Bu(t, e, n, i, u, s) {
    var f = 0;
    if (i = t, typeof i == "function") ar(i) && (f = 1);
    else if (typeof i == "string")
      f = hb(
        t,
        n,
        rn.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (i) {
        case Te:
          return t = Ee(31, n, e, u), t.elementType = Te, t.lanes = s, t;
        case Yt:
          return zi(n.children, u, s, e);
        case Ht:
          f = 8, u |= 24;
          break;
        case Lt:
          return t = Ee(12, n, e, u | 2), t.elementType = Lt, t.lanes = s, t;
        case K:
          return t = Ee(13, n, e, u), t.elementType = K, t.lanes = s, t;
        case k:
          return t = Ee(19, n, e, u), t.elementType = k, t.lanes = s, t;
        case xn:
        case A:
          return t = u | 32, t = Ee(30, n, e, t), t.elementType = A, t.lanes = s, t.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, t;
        default:
          if (typeof i == "object" && i !== null)
            switch (i.$$typeof) {
              case wt:
                f = 10;
                break t;
              case Se:
                f = 9;
                break t;
              case G:
                f = 11;
                break t;
              case mt:
                f = 14;
                break t;
              case yt:
                f = 16, i = null;
                break t;
            }
          f = 29, n = Error(
            r(130, t === null ? "null" : typeof t, "")
          ), i = null;
      }
    return e = Ee(f, n, e, u), e.elementType = t, e.type = i, e.lanes = s, e;
  }
  function zi(t, e, n, i) {
    return t = Ee(7, t, i, e), t.lanes = n, t;
  }
  function lr(t, e, n) {
    return t = Ee(6, t, null, e), t.lanes = n, t;
  }
  function Gd(t) {
    var e = Ee(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function ur(t, e, n) {
    return e = Ee(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = n, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var qd = /* @__PURE__ */ new WeakMap();
  function qe(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = qd.get(t);
      return n !== void 0 ? n : (e = {
        value: t,
        source: e,
        stack: Bh(e)
      }, qd.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: Bh(e)
    };
  }
  var ma = [], ya = 0, Hu = null, gl = 0, Xe = [], Qe = 0, kn = null, fn = 1, hn = "";
  function Un(t, e) {
    ma[ya++] = gl, ma[ya++] = Hu, Hu = t, gl = e;
  }
  function Xd(t, e, n) {
    Xe[Qe++] = fn, Xe[Qe++] = hn, Xe[Qe++] = kn, kn = t;
    var i = fn;
    t = hn;
    var u = 32 - ze(i) - 1;
    i &= ~(1 << u), n += 1;
    var s = 32 - ze(e) + u;
    if (30 < s) {
      var f = u - u % 5;
      s = (i & (1 << f) - 1).toString(32), i >>= f, u -= f, fn = 1 << 32 - ze(e) + u | n << u | i, hn = s + t;
    } else
      fn = 1 << s | n << u | i, hn = t;
  }
  function Lu(t) {
    t.return !== null && (Un(t, 1), Xd(t, 1, 0));
  }
  function sr(t) {
    for (; t === Hu; )
      Hu = ma[--ya], ma[ya] = null, gl = ma[--ya], ma[ya] = null;
    for (; t === kn; )
      kn = Xe[--Qe], Xe[Qe] = null, hn = Xe[--Qe], Xe[Qe] = null, fn = Xe[--Qe], Xe[Qe] = null;
  }
  function Qd(t, e) {
    Xe[Qe++] = fn, Xe[Qe++] = hn, Xe[Qe++] = kn, fn = e.id, hn = e.overflow, kn = t;
  }
  var $t = null, Nt = null, st = !1, Wn = null, Ze = !1, or = Error(r(519));
  function In(t) {
    var e = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw vl(qe(e, t)), or;
  }
  function Zd(t) {
    var e = t.stateNode, n = t.type, i = t.memoizedProps;
    switch (e[ie] = t, e[be] = i, n) {
      case "dialog":
        ft("cancel", e), ft("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        ft("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < jl.length; n++)
          ft(jl[n], e);
        break;
      case "source":
        ft("error", e);
        break;
      case "img":
      case "image":
      case "link":
        ft("error", e), ft("load", e);
        break;
      case "details":
        ft("toggle", e);
        break;
      case "input":
        ft("invalid", e), id(
          e,
          i.value,
          i.defaultValue,
          i.checked,
          i.defaultChecked,
          i.type,
          i.name,
          !0
        );
        break;
      case "select":
        ft("invalid", e);
        break;
      case "textarea":
        ft("invalid", e), ld(e, i.value, i.defaultValue, i.children);
    }
    n = i.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || i.suppressHydrationWarning === !0 || hg(e.textContent, n) ? (i.popover != null && (ft("beforetoggle", e), ft("toggle", e)), i.onScroll != null && ft("scroll", e), i.onScrollEnd != null && ft("scrollend", e), i.onClick != null && (e.onclick = cn), e = !0) : e = !1, e || In(t, !0);
  }
  function ju(t) {
    for ($t = t.return; $t; )
      switch ($t.tag) {
        case 5:
        case 31:
        case 13:
          Ze = !1;
          return;
        case 27:
        case 3:
          Ze = !0;
          return;
        default:
          $t = $t.return;
      }
  }
  function ga(t) {
    if (t !== $t) return !1;
    if (!st) return ju(t), st = !0, !1;
    var e = t.tag, n;
    if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || Lc(t.type, t.memoizedProps)), n = !n), n && Nt && In(t), ju(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      Nt = _g(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      Nt = _g(t);
    } else
      e === 27 ? (e = Nt, mi(t.type) ? (t = Jc, Jc = null, Nt = t) : Nt = e) : Nt = $t ? Je(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Ri() {
    Nt = $t = null, st = !1;
  }
  function rr() {
    var t = Wn;
    return t !== null && (Me === null ? Me = t : Me.push.apply(
      Me,
      t
    ), Wn = null), t;
  }
  function vl(t) {
    Wn === null ? Wn = [t] : Wn.push(t);
  }
  var cr = on(null), _i = null, wn = null;
  function $n(t, e, n) {
    _t(cr, e._currentValue), e._currentValue = n;
  }
  function Bn(t) {
    t._currentValue = cr.current, ne(cr);
  }
  function Yu(t, e, n) {
    for (; t !== null; ) {
      var i = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, i !== null && (i.childLanes |= e)) : i !== null && (i.childLanes & e) !== e && (i.childLanes |= e), t === n) break;
      t = t.return;
    }
  }
  function fr(t, e, n, i) {
    var u = t.child;
    for (u !== null && (u.return = t); u !== null; ) {
      var s = u.dependencies;
      if (s !== null) {
        var f = u.child;
        s = s.firstContext;
        t: for (; s !== null; ) {
          var y = s;
          s = u;
          for (var T = 0; T < e.length; T++)
            if (y.context === e[T]) {
              s.lanes |= n, y = s.alternate, y !== null && (y.lanes |= n), Yu(
                s.return,
                n,
                t
              ), i || (f = null);
              break t;
            }
          s = y.next;
        }
      } else if (u.tag === 18) {
        if (f = u.return, f === null) throw Error(r(341));
        f.lanes |= n, s = f.alternate, s !== null && (s.lanes |= n), Yu(f, n, t), f = null;
      } else
        u.tag === 13 && u.memoizedState !== null && u.memoizedState.dehydrated === null ? (u.lanes |= n, f = u.alternate, f !== null && (f.lanes |= n), Yu(
          u.return,
          n,
          t
        ), f = u.child, f = f !== null ? f.sibling : null) : f = u.child;
      if (f !== null) f.return = u;
      else
        for (f = u; f !== null; ) {
          if (f === t) {
            f = null;
            break;
          }
          if (u = f.sibling, u !== null) {
            u.return = f.return, f = u;
            break;
          }
          f = f.return;
        }
      u = f;
    }
  }
  function Ni(t, e, n, i) {
    t = null;
    for (var u = e, s = !1; u !== null; ) {
      if (!s) {
        if ((u.flags & 524288) !== 0) s = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var f = u.alternate;
        if (f === null) throw Error(r(387));
        if (f = f.memoizedProps, f !== null) {
          var y = u.type;
          _e(u.pendingProps.value, f.value) || (t !== null ? t.push(y) : t = [y]);
        }
      } else if (u === du.current) {
        if (f = u.alternate, f === null) throw Error(r(387));
        f.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(Ga) : t = [Ga]);
      }
      u = u.return;
    }
    return t !== null && fr(
      e,
      t,
      n,
      i
    ), e.flags |= 262144, t !== null;
  }
  function Gu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!_e(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Vi(t) {
    _i = t, wn = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function ae(t) {
    return Kd(_i, t);
  }
  function qu(t, e) {
    return _i === null && Vi(t), Kd(t, e);
  }
  function Kd(t, e) {
    var n = e._currentValue;
    if (e = { context: e, memoizedValue: n, next: null }, wn === null) {
      if (t === null) throw Error(r(308));
      wn = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else wn = wn.next = e;
    return n;
  }
  var jS = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(n, i) {
        t.push(i);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(n) {
        return n();
      });
    };
  }, YS = a.unstable_scheduleCallback, GS = a.unstable_NormalPriority, Qt = {
    $$typeof: wt,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function hr() {
    return {
      controller: new jS(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function pl(t) {
    t.refCount--, t.refCount === 0 && YS(GS, function() {
      t.controller.abort();
    });
  }
  function Jd(t, e) {
    if ((t.pendingLanes & 4194048) !== 0) {
      var n = t.transitionTypes;
      for (n === null && (n = t.transitionTypes = []), t = 0; t < e.length; t++) {
        var i = e[t];
        n.indexOf(i) === -1 && n.push(i);
      }
    }
  }
  var Sl = null;
  function qS(t) {
    var e = t.transitionTypes;
    return t.transitionTypes = null, e;
  }
  var Tl = null, dr = 0, Ui = 0, va = null;
  function XS(t, e) {
    if (Tl === null) {
      var n = Tl = [];
      dr = 0, Ui = zc(), va = {
        status: "pending",
        value: void 0,
        then: function(i) {
          n.push(i);
        }
      };
    }
    return dr++, e.then(Pd, Pd), e;
  }
  function Pd() {
    if (--dr === 0 && (Sl = null, Tl !== null)) {
      va !== null && (va.status = "fulfilled");
      var t = Tl;
      Tl = null, Ui = 0, va = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function QS(t, e) {
    var n = [], i = {
      status: "pending",
      value: null,
      reason: null,
      then: function(u) {
        n.push(u);
      }
    };
    return t.then(
      function() {
        i.status = "fulfilled", i.value = e;
        for (var u = 0; u < n.length; u++) (0, n[u])(e);
      },
      function(u) {
        for (i.status = "rejected", i.reason = u, u = 0; u < n.length; u++)
          (0, n[u])(void 0);
      }
    ), i;
  }
  var Fd = F.S;
  F.S = function(t, e) {
    if (Gy = Ce(), typeof e == "object" && e !== null && typeof e.then == "function" && XS(t, e), Sl !== null)
      for (var n = wa; n !== null; )
        Jd(n, Sl), n = n.next;
    if (n = t.types, n !== null) {
      for (var i = wa; i !== null; )
        Jd(i, n), i = i.next;
      if (Ui !== 0) {
        i = Sl, i === null && (i = Sl = []);
        for (var u = 0; u < n.length; u++) {
          var s = n[u];
          i.indexOf(s) === -1 && i.push(s);
        }
      }
    }
    Fd !== null && Fd(t, e);
  };
  var wi = on(null);
  function mr() {
    var t = wi.current;
    return t !== null ? t : Rt.pooledCache;
  }
  function Xu(t, e) {
    e === null ? _t(wi, wi.current) : _t(wi, e.pool);
  }
  function kd() {
    var t = mr();
    return t === null ? null : { parent: Qt._currentValue, pool: t };
  }
  var pa = Error(r(460)), yr = Error(r(474)), Qu = Error(r(542)), Zu = { then: function() {
  } };
  function Wd(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Id(t, e, n) {
    switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(cn, cn), e = n), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, tm(t), t === void 0 && !("reason" in e) ? Error(r(600)) : t;
      default:
        if (typeof e.status == "string") e.then(cn, cn);
        else {
          if (t = Rt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(r(482));
          t = e, t.status = "pending", t.then(
            function(i) {
              if (e.status === "pending") {
                var u = e;
                u.status = "fulfilled", u.value = i;
              }
            },
            function(i) {
              if (e.status === "pending") {
                var u = e;
                u.status = "rejected", u.reason = i;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, tm(t), t;
        }
        throw Hi = e, pa;
    }
  }
  function Bi(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Hi = n, pa) : n;
    }
  }
  var Hi = null;
  function $d() {
    if (Hi === null) throw Error(r(459));
    var t = Hi;
    return Hi = null, t;
  }
  function tm(t) {
    if (t === pa || t === Qu)
      throw Error(r(483));
  }
  var Sa = null, bl = 0;
  function Ku(t) {
    var e = bl;
    return bl += 1, Sa === null && (Sa = []), Id(Sa, t, e);
  }
  function ti(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Ju(t, e) {
    throw e.$$typeof === L ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function em(t) {
    function e(M, E) {
      if (t) {
        var C = M.deletions;
        C === null ? (M.deletions = [E], M.flags |= 16) : C.push(E);
      }
    }
    function n(M, E) {
      if (!t) return null;
      for (; E !== null; )
        e(M, E), E = E.sibling;
      return null;
    }
    function i(M) {
      for (var E = /* @__PURE__ */ new Map(); M !== null; )
        M.key === null ? E.set(M.index, M) : E.set(M.key, M), M = M.sibling;
      return E;
    }
    function u(M, E) {
      return M = Vn(M, E), M.index = 0, M.sibling = null, M;
    }
    function s(M, E, C) {
      return M.index = C, t ? (C = M.alternate, C !== null ? (C = C.index, C < E ? (M.flags |= 2, E) : C) : (M.flags |= 134217730, E)) : (M.flags |= 1048576, E);
    }
    function f(M) {
      return t && M.alternate === null && (M.flags |= 134217730), M;
    }
    function y(M, E, C, N) {
      return E === null || E.tag !== 6 ? (E = lr(C, M.mode, N), E.return = M, E) : (E = u(E, C), E.return = M, E);
    }
    function T(M, E, C, N) {
      var X = C.type;
      return X === Yt ? (M = z(
        M,
        E,
        C.props.children,
        N,
        C.key
      ), ti(M, C), M) : E !== null && (E.elementType === X || typeof X == "object" && X !== null && X.$$typeof === yt && Bi(X) === E.type) ? (E = u(E, C.props), ti(E, C), E.return = M, E) : (E = Bu(
        C.type,
        C.key,
        C.props,
        null,
        M.mode,
        N
      ), ti(E, C), E.return = M, E);
    }
    function x(M, E, C, N) {
      return E === null || E.tag !== 4 || E.stateNode.containerInfo !== C.containerInfo || E.stateNode.implementation !== C.implementation ? (E = ur(C, M.mode, N), E.return = M, E) : (E = u(E, C.children || []), E.return = M, E);
    }
    function z(M, E, C, N, X) {
      return E === null || E.tag !== 7 ? (E = zi(
        C,
        M.mode,
        N,
        X
      ), E.return = M, E) : (E = u(E, C), E.return = M, E);
    }
    function U(M, E, C) {
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return E = lr(
          "" + E,
          M.mode,
          C
        ), E.return = M, E;
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case pt:
            return C = Bu(
              E.type,
              E.key,
              E.props,
              null,
              M.mode,
              C
            ), ti(C, E), C.return = M, C;
          case rt:
            return E = ur(
              E,
              M.mode,
              C
            ), E.return = M, E;
          case yt:
            return E = Bi(E), U(M, E, C);
        }
        if (Et(E) || tt(E))
          return E = zi(
            E,
            M.mode,
            C,
            null
          ), E.return = M, E;
        if (typeof E.then == "function")
          return U(M, Ku(E), C);
        if (E.$$typeof === wt)
          return U(
            M,
            qu(M, E),
            C
          );
        Ju(M, E);
      }
      return null;
    }
    function D(M, E, C, N) {
      var X = E !== null ? E.key : null;
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return X !== null ? null : y(M, E, "" + C, N);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case pt:
            return C.key === X ? T(M, E, C, N) : null;
          case rt:
            return C.key === X ? x(M, E, C, N) : null;
          case yt:
            return C = Bi(C), D(M, E, C, N);
        }
        if (Et(C) || tt(C))
          return X !== null ? null : z(M, E, C, N, null);
        if (typeof C.then == "function")
          return D(
            M,
            E,
            Ku(C),
            N
          );
        if (C.$$typeof === wt)
          return D(
            M,
            E,
            qu(M, C),
            N
          );
        Ju(M, C);
      }
      return null;
    }
    function O(M, E, C, N, X) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return M = M.get(C) || null, y(E, M, "" + N, X);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case pt:
            return M = M.get(
              N.key === null ? C : N.key
            ) || null, T(E, M, N, X);
          case rt:
            return M = M.get(
              N.key === null ? C : N.key
            ) || null, x(E, M, N, X);
          case yt:
            return N = Bi(N), O(
              M,
              E,
              C,
              N,
              X
            );
        }
        if (Et(N) || tt(N))
          return M = M.get(C) || null, z(E, M, N, X, null);
        if (typeof N.then == "function")
          return O(
            M,
            E,
            C,
            Ku(N),
            X
          );
        if (N.$$typeof === wt)
          return O(
            M,
            E,
            C,
            qu(E, N),
            X
          );
        Ju(E, N);
      }
      return null;
    }
    function j(M, E, C, N) {
      for (var X = null, dt = null, W = E, et = E = 0, Jt = null; W !== null && et < C.length; et++) {
        W.index > et ? (Jt = W, W = null) : Jt = W.sibling;
        var gt = D(
          M,
          W,
          C[et],
          N
        );
        if (gt === null) {
          W === null && (W = Jt);
          break;
        }
        t && W && gt.alternate === null && e(M, W), E = s(gt, E, et), dt === null ? X = gt : dt.sibling = gt, dt = gt, W = Jt;
      }
      if (et === C.length)
        return n(M, W), st && Un(M, et), X;
      if (W === null) {
        for (; et < C.length; et++)
          W = U(M, C[et], N), W !== null && (E = s(
            W,
            E,
            et
          ), dt === null ? X = W : dt.sibling = W, dt = W);
        return st && Un(M, et), X;
      }
      for (W = i(W); et < C.length; et++)
        Jt = O(
          W,
          M,
          et,
          C[et],
          N
        ), Jt !== null && (t && (gt = Jt.alternate, gt !== null && W.delete(gt.key === null ? et : gt.key)), E = s(
          Jt,
          E,
          et
        ), dt === null ? X = Jt : dt.sibling = Jt, dt = Jt);
      return t && W.forEach(function(Si) {
        return e(M, Si);
      }), st && Un(M, et), X;
    }
    function J(M, E, C, N) {
      if (C == null) throw Error(r(151));
      for (var X = null, dt = null, W = E, et = E = 0, Jt = null, gt = C.next(); W !== null && !gt.done; et++, gt = C.next()) {
        W.index > et ? (Jt = W, W = null) : Jt = W.sibling;
        var Si = D(M, W, gt.value, N);
        if (Si === null) {
          W === null && (W = Jt);
          break;
        }
        t && W && Si.alternate === null && e(M, W), E = s(Si, E, et), dt === null ? X = Si : dt.sibling = Si, dt = Si, W = Jt;
      }
      if (gt.done)
        return n(M, W), st && Un(M, et), X;
      if (W === null) {
        for (; !gt.done; et++, gt = C.next())
          gt = U(M, gt.value, N), gt !== null && (E = s(gt, E, et), dt === null ? X = gt : dt.sibling = gt, dt = gt);
        return st && Un(M, et), X;
      }
      for (W = i(W); !gt.done; et++, gt = C.next())
        gt = O(W, M, et, gt.value, N), gt !== null && (t && (Jt = gt.alternate, Jt !== null && W.delete(
          Jt.key === null ? et : Jt.key
        )), E = s(gt, E, et), dt === null ? X = gt : dt.sibling = gt, dt = gt);
      return t && W.forEach(function(Db) {
        return e(M, Db);
      }), st && Un(M, et), X;
    }
    function ut(M, E, C, N) {
      if (typeof C == "object" && C !== null && C.type === Yt && C.key === null && C.props.ref === void 0 && (C = C.props.children), typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case pt:
            t: {
              for (var X = C.key; E !== null; ) {
                if (E.key === X) {
                  if (X = C.type, X === Yt) {
                    if (E.tag === 7) {
                      n(
                        M,
                        E.sibling
                      ), N = u(
                        E,
                        C.props.children
                      ), ti(N, C), N.return = M, M = N;
                      break t;
                    }
                  } else if (E.elementType === X || typeof X == "object" && X !== null && X.$$typeof === yt && Bi(X) === E.type) {
                    n(
                      M,
                      E.sibling
                    ), N = u(E, C.props), ti(N, C), N.return = M, M = N;
                    break t;
                  }
                  n(M, E);
                  break;
                } else e(M, E);
                E = E.sibling;
              }
              C.type === Yt ? (N = zi(
                C.props.children,
                M.mode,
                N,
                C.key
              ), ti(N, C), N.return = M, M = N) : (N = Bu(
                C.type,
                C.key,
                C.props,
                null,
                M.mode,
                N
              ), ti(N, C), N.return = M, M = N);
            }
            return f(M);
          case rt:
            t: {
              for (X = C.key; E !== null; ) {
                if (E.key === X)
                  if (E.tag === 4 && E.stateNode.containerInfo === C.containerInfo && E.stateNode.implementation === C.implementation) {
                    n(
                      M,
                      E.sibling
                    ), N = u(E, C.children || []), N.return = M, M = N;
                    break t;
                  } else {
                    n(M, E);
                    break;
                  }
                else e(M, E);
                E = E.sibling;
              }
              N = ur(C, M.mode, N), N.return = M, M = N;
            }
            return f(M);
          case yt:
            return C = Bi(C), ut(
              M,
              E,
              C,
              N
            );
        }
        if (Et(C))
          return j(
            M,
            E,
            C,
            N
          );
        if (tt(C)) {
          if (X = tt(C), typeof X != "function") throw Error(r(150));
          return C = X.call(C), J(
            M,
            E,
            C,
            N
          );
        }
        if (typeof C.then == "function")
          return ut(
            M,
            E,
            Ku(C),
            N
          );
        if (C.$$typeof === wt)
          return ut(
            M,
            E,
            qu(M, C),
            N
          );
        Ju(M, C);
      }
      return typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint" ? (C = "" + C, E !== null && E.tag === 6 ? (n(M, E.sibling), N = u(E, C), N.return = M, M = N) : (n(M, E), N = lr(C, M.mode, N), N.return = M, M = N), f(M)) : n(M, E);
    }
    return function(M, E, C, N) {
      try {
        bl = 0;
        var X = ut(
          M,
          E,
          C,
          N
        );
        return Sa = null, X;
      } catch (W) {
        if (W === pa || W === Qu) throw W;
        var dt = Ee(29, W, null, M.mode);
        return dt.lanes = N, dt.return = M, dt;
      }
    };
  }
  var Li = em(!0), nm = em(!1), ei = !1;
  function gr(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function vr(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function ni(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ii(t, e, n) {
    var i = t.updateQueue;
    if (i === null) return null;
    if (i = i.shared, (At & 2) !== 0) {
      var u = i.pending;
      return u === null ? e.next = e : (e.next = u.next, u.next = e), i.pending = e, e = wu(t), jd(t, null, n), e;
    }
    return Uu(t, i, e, n), wu(t);
  }
  function El(t, e, n) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, Xh(t, n);
    }
  }
  function pr(t, e) {
    var n = t.updateQueue, i = t.alternate;
    if (i !== null && (i = i.updateQueue, n === i)) {
      var u = null, s = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var f = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          s === null ? u = s = f : s = s.next = f, n = n.next;
        } while (n !== null);
        s === null ? u = s = e : s = s.next = e;
      } else u = s = e;
      n = {
        baseState: i.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: s,
        shared: i.shared,
        callbacks: i.callbacks
      }, t.updateQueue = n;
      return;
    }
    t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
  }
  var Sr = !1;
  function Al() {
    if (Sr) {
      var t = va;
      if (t !== null) throw t;
    }
  }
  function Dl(t, e, n, i) {
    Sr = !1;
    var u = t.updateQueue;
    ei = !1;
    var s = u.firstBaseUpdate, f = u.lastBaseUpdate, y = u.shared.pending;
    if (y !== null) {
      u.shared.pending = null;
      var T = y, x = T.next;
      T.next = null, f === null ? s = x : f.next = x, f = T;
      var z = t.alternate;
      z !== null && (z = z.updateQueue, y = z.lastBaseUpdate, y !== f && (y === null ? z.firstBaseUpdate = x : y.next = x, z.lastBaseUpdate = T));
    }
    if (s !== null) {
      var U = u.baseState;
      f = 0, z = x = T = null, y = s;
      do {
        var D = y.lane & -536870913, O = D !== y.lane;
        if (O ? (ht & D) === D : (i & D) === D) {
          D !== 0 && D === Ui && (Sr = !0), z !== null && (z = z.next = {
            lane: 0,
            tag: y.tag,
            payload: y.payload,
            callback: null,
            next: null
          });
          t: {
            var j = t, J = y;
            D = e;
            var ut = n;
            switch (J.tag) {
              case 1:
                if (j = J.payload, typeof j == "function") {
                  U = j.call(ut, U, D);
                  break t;
                }
                U = j;
                break t;
              case 3:
                j.flags = j.flags & -65537 | 128;
              case 0:
                if (j = J.payload, D = typeof j == "function" ? j.call(ut, U, D) : j, D == null) break t;
                U = w({}, U, D);
                break t;
              case 2:
                ei = !0;
            }
          }
          D = y.callback, D !== null && (t.flags |= 64, O && (t.flags |= 8192), O = u.callbacks, O === null ? u.callbacks = [D] : O.push(D));
        } else
          O = {
            lane: D,
            tag: y.tag,
            payload: y.payload,
            callback: y.callback,
            next: null
          }, z === null ? (x = z = O, T = U) : z = z.next = O, f |= D;
        if (y = y.next, y === null) {
          if (y = u.shared.pending, y === null)
            break;
          O = y, y = O.next, O.next = null, u.lastBaseUpdate = O, u.shared.pending = null;
        }
      } while (!0);
      z === null && (T = U), u.baseState = T, u.firstBaseUpdate = x, u.lastBaseUpdate = z, s === null && (u.shared.lanes = 0), ci |= f, t.lanes = f, t.memoizedState = U;
    }
  }
  function im(t, e) {
    if (typeof t != "function")
      throw Error(r(191, t));
    t.call(e);
  }
  function am(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++)
        im(n[t], e);
  }
  var ai = on(null), Pu = on(0);
  function lm(t, e) {
    t = Gn, _t(Pu, t), _t(ai, e), Gn = t | e.baseLanes;
  }
  function Tr() {
    _t(Pu, Gn), _t(ai, ai.current);
  }
  function br() {
    Gn = Pu.current, ne(ai), ne(Pu);
  }
  var le = on(null), de = null;
  function li(t) {
    var e = t.alternate;
    _t(ue, ue.current & 1), _t(le, t), de === null && (e === null || ai.current !== null || e.memoizedState !== null) && (de = t);
  }
  function Er(t) {
    _t(ue, ue.current), _t(le, t), de === null && (de = t);
  }
  function um(t) {
    t.tag === 22 ? (_t(ue, ue.current), _t(le, t), de === null && (de = t)) : ui();
  }
  function ui() {
    _t(ue, ue.current), _t(le, le.current);
  }
  function Ne(t) {
    ne(le), de === t && (de = null), ne(ue);
  }
  var ue = on(0);
  function Ml(t, e) {
    _t(le, le.current), _t(ue, e);
  }
  function Ar(t) {
    ne(ue), ne(le), de === t && (de = null);
  }
  function Fu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || Zc(n) || Kc(n)))
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== "independent") {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var Hn = 0, lt = null, Ot = null, Zt = null, ku = !1, Ta = !1, ji = !1, Wu = 0, xl = 0, ba = null, ZS = 0;
  function Gt() {
    throw Error(r(321));
  }
  function Dr(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!_e(t[n], e[n])) return !1;
    return !0;
  }
  function Mr(t, e, n, i, u, s) {
    return Hn = s, lt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, F.H = t === null || t.memoizedState === null ? Xm : Qm, ji = !1, s = n(i, u), ji = !1, Ta && (s = om(
      e,
      n,
      i,
      u
    )), sm(t), s;
  }
  function sm(t) {
    F.H = as;
    var e = Ot !== null && Ot.next !== null;
    if (Hn = 0, Zt = Ot = lt = null, ku = !1, xl = 0, ba = null, e) throw Error(r(300));
    t === null || Kt || (t = t.dependencies, t !== null && Gu(t) && (Kt = !0));
  }
  function om(t, e, n, i) {
    lt = t;
    var u = 0;
    do {
      if (Ta && (ba = null), xl = 0, Ta = !1, 25 <= u) throw Error(r(301));
      if (u += 1, Zt = Ot = null, t.updateQueue != null) {
        var s = t.updateQueue;
        s.lastEffect = null, s.events = null, s.stores = null, s.memoCache != null && (s.memoCache.index = 0);
      }
      F.H = $S, s = e(n, i);
    } while (Ta);
    return s;
  }
  function KS() {
    var t = F.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? Cl(e) : e, t = t.useState()[0], (Ot !== null ? Ot.memoizedState : null) !== t && (lt.flags |= 1024), e;
  }
  function xr() {
    var t = Wu !== 0;
    return Wu = 0, t;
  }
  function Cr(t, e, n) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
  }
  function Or(t) {
    if (ku) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      ku = !1;
    }
    Hn = 0, Zt = Ot = lt = null, Ta = !1, xl = Wu = 0, ba = null;
  }
  function ye() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Zt === null ? lt.memoizedState = Zt = t : Zt = Zt.next = t, Zt;
  }
  function Xt() {
    if (Ot === null) {
      var t = lt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Ot.next;
    var e = Zt === null ? lt.memoizedState : Zt.next;
    if (e !== null)
      Zt = e, Ot = t;
    else {
      if (t === null)
        throw lt.alternate === null ? Error(r(467)) : Error(r(310));
      Ot = t, t = {
        memoizedState: Ot.memoizedState,
        baseState: Ot.baseState,
        baseQueue: Ot.baseQueue,
        queue: Ot.queue,
        next: null
      }, Zt === null ? lt.memoizedState = Zt = t : Zt = Zt.next = t;
    }
    return Zt;
  }
  function Iu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Cl(t) {
    var e = xl;
    return xl += 1, ba === null && (ba = []), t = Id(ba, t, e), e = lt, (Zt === null ? e.memoizedState : Zt.next) === null && (e = e.alternate, F.H = e === null || e.memoizedState === null ? Xm : Qm), t;
  }
  function $u(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Cl(t);
      if (t.$$typeof === H) return;
      if (t.$$typeof === wt) return ae(t);
    }
    throw Error(r(438, String(t)));
  }
  function zr(t) {
    var e = null, n = lt.updateQueue;
    if (n !== null && (e = n.memoCache), e == null) {
      var i = lt.alternate;
      i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (e = {
        data: i.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), n === null && (n = Iu(), lt.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0)
      for (n = e.data[e.index] = Array(t), i = 0; i < t; i++)
        n[i] = Ei;
    return e.index++, n;
  }
  function Ln(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function ts(t) {
    var e = Xt();
    return Rr(e, Ot, t);
  }
  function Rr(t, e, n) {
    var i = t.queue;
    if (i === null) throw Error(r(311));
    i.lastRenderedReducer = n;
    var u = t.baseQueue, s = i.pending;
    if (s !== null) {
      if (u !== null) {
        var f = u.next;
        u.next = s.next, s.next = f;
      }
      e.baseQueue = u = s, i.pending = null;
    }
    if (s = t.baseState, u === null) t.memoizedState = s;
    else {
      e = u.next;
      var y = f = null, T = null, x = e, z = !1;
      do {
        var U = x.lane & -536870913;
        if (U !== x.lane ? (ht & U) === U : (Hn & U) === U) {
          var D = x.revertLane;
          if (D === 0)
            T !== null && (T = T.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: x.action,
              hasEagerState: x.hasEagerState,
              eagerState: x.eagerState,
              next: null
            }), U === Ui && (z = !0);
          else if ((Hn & D) === D) {
            x = x.next, D === Ui && (z = !0);
            continue;
          } else
            U = {
              lane: 0,
              revertLane: x.revertLane,
              gesture: null,
              action: x.action,
              hasEagerState: x.hasEagerState,
              eagerState: x.eagerState,
              next: null
            }, T === null ? (y = T = U, f = s) : T = T.next = U, lt.lanes |= D, ci |= D;
          U = x.action, ji && n(s, U), s = x.hasEagerState ? x.eagerState : n(s, U);
        } else
          D = {
            lane: U,
            revertLane: x.revertLane,
            gesture: x.gesture,
            action: x.action,
            hasEagerState: x.hasEagerState,
            eagerState: x.eagerState,
            next: null
          }, T === null ? (y = T = D, f = s) : T = T.next = D, lt.lanes |= U, ci |= U;
        x = x.next;
      } while (x !== null && x !== e);
      if (T === null ? f = s : T.next = y, !_e(s, t.memoizedState) && (Kt = !0, z && (n = va, n !== null)))
        throw n;
      t.memoizedState = s, t.baseState = f, t.baseQueue = T, i.lastRenderedState = s;
    }
    return u === null && (i.lanes = 0), [t.memoizedState, i.dispatch];
  }
  function _r(t) {
    var e = Xt(), n = e.queue;
    if (n === null) throw Error(r(311));
    n.lastRenderedReducer = t;
    var i = n.dispatch, u = n.pending, s = e.memoizedState;
    if (u !== null) {
      n.pending = null;
      var f = u = u.next;
      do
        s = t(s, f.action), f = f.next;
      while (f !== u);
      _e(s, e.memoizedState) || (Kt = !0), e.memoizedState = s, e.baseQueue === null && (e.baseState = s), n.lastRenderedState = s;
    }
    return [s, i];
  }
  function rm(t, e, n) {
    var i = lt, u = Xt(), s = st;
    if (s) {
      if (n === void 0) throw Error(r(407));
      n = n();
    } else n = e();
    var f = !_e(
      (Ot || u).memoizedState,
      n
    );
    if (f && (u.memoizedState = n, Kt = !0), u = u.queue, Ur(hm.bind(null, i, u, t), [
      t
    ]), t = u.getSnapshot !== e || f || Zt !== null && (Zt.memoizedState.tag & 1) !== 0, Ea(
      t ? 9 : 8,
      { destroy: void 0 },
      fm.bind(null, i, u, n, e),
      null
    ), t) {
      if (i.flags |= 2048, Rt === null) throw Error(r(349));
      s || (Hn & 127) !== 0 || cm(i, e, n);
    }
    return n;
  }
  function cm(t, e, n) {
    t.flags |= 16384, t = { getSnapshot: e, value: n }, e = lt.updateQueue, e === null ? (e = Iu(), lt.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
  }
  function fm(t, e, n, i) {
    e.value = n, e.getSnapshot = i, dm(e) && mm(t);
  }
  function hm(t, e, n) {
    return n(function() {
      dm(e) && mm(t);
    });
  }
  function dm(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !_e(t, n);
    } catch {
      return !0;
    }
  }
  function mm(t) {
    var e = Oi(t, 2);
    e !== null && xe(e, t, 2);
  }
  function Nr(t) {
    var e = ye();
    if (typeof t == "function") {
      var n = t;
      if (t = n(), ji) {
        Jn(!0);
        try {
          n();
        } finally {
          Jn(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ln,
      lastRenderedState: t
    }, e;
  }
  function ym(t, e, n, i) {
    return t.baseState = n, Rr(
      t,
      Ot,
      typeof i == "function" ? i : Ln
    );
  }
  function JS(t, e, n, i, u) {
    if (is(t)) throw Error(r(485));
    if (t = e.action, t !== null) {
      var s = {
        payload: u,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          s.listeners.push(f);
        }
      };
      F.T !== null ? n(!0) : s.isTransition = !1, i(s), n = e.pending, n === null ? (s.next = e.pending = s, gm(e, s)) : (s.next = n.next, e.pending = n.next = s);
    }
  }
  function gm(t, e) {
    var n = e.action, i = e.payload, u = t.state;
    if (e.isTransition) {
      var s = F.T, f = {};
      f.types = s !== null ? s.types : null, F.T = f;
      try {
        var y = n(u, i), T = F.S;
        T !== null && T(f, y), vm(t, e, y);
      } catch (x) {
        Vr(t, e, x);
      } finally {
        s !== null && f.types !== null && (s.types = f.types), F.T = s;
      }
    } else
      try {
        s = n(u, i), vm(t, e, s);
      } catch (x) {
        Vr(t, e, x);
      }
  }
  function vm(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(i) {
        pm(t, e, i);
      },
      function(i) {
        return Vr(t, e, i);
      }
    ) : pm(t, e, n);
  }
  function pm(t, e, n) {
    e.status = "fulfilled", e.value = n, Sm(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, gm(t, n)));
  }
  function Vr(t, e, n) {
    var i = t.pending;
    if (t.pending = null, i !== null) {
      i = i.next;
      do
        e.status = "rejected", e.reason = n, Sm(e), e = e.next;
      while (e !== i);
    }
    t.action = null;
  }
  function Sm(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Tm(t, e) {
    return e;
  }
  function bm(t, e) {
    if (st) {
      var n = Rt.formState;
      if (n !== null) {
        t: {
          var i = lt;
          if (st) {
            if (Nt) {
              e: {
                for (var u = Nt, s = Ze; u.nodeType !== 8; ) {
                  if (!s) {
                    u = null;
                    break e;
                  }
                  if (u = Je(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break e;
                  }
                }
                s = u.data, u = s === "F!" || s === "F" ? u : null;
              }
              if (u) {
                Nt = Je(
                  u.nextSibling
                ), i = u.data === "F!";
                break t;
              }
            }
            In(i);
          }
          i = !1;
        }
        i && (e = n[0]);
      }
    }
    return n = ye(), n.memoizedState = n.baseState = e, i = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Tm,
      lastRenderedState: e
    }, n.queue = i, n = Ym.bind(
      null,
      lt,
      i
    ), i.dispatch = n, i = Nr(!1), s = jr.bind(
      null,
      lt,
      !1,
      i.queue
    ), i = ye(), u = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, i.queue = u, n = JS.bind(
      null,
      lt,
      u,
      s,
      n
    ), u.dispatch = n, i.memoizedState = t, [e, n, !1];
  }
  function Em(t) {
    var e = Xt();
    return Am(e, Ot, t);
  }
  function Am(t, e, n) {
    if (e = Rr(
      t,
      e,
      Tm
    )[0], t = ts(Ln)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var i = Cl(e);
      } catch (f) {
        throw f === pa ? Qu : f;
      }
    else i = e;
    e = Xt();
    var u = e.queue, s = u.dispatch;
    return n !== e.memoizedState && (lt.flags |= 2048, Ea(
      9,
      { destroy: void 0 },
      PS.bind(null, u, n),
      null
    )), [i, s, t];
  }
  function PS(t, e) {
    t.action = e;
  }
  function Dm(t) {
    var e = Xt(), n = Ot;
    if (n !== null)
      return Am(e, n, t);
    Xt(), e = e.memoizedState, n = Xt();
    var i = n.queue.dispatch;
    return n.memoizedState = t, [e, i, !1];
  }
  function Ea(t, e, n, i) {
    return t = { tag: t, create: n, deps: i, inst: e, next: null }, e = lt.updateQueue, e === null && (e = Iu(), lt.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (i = n.next, n.next = t, t.next = i, e.lastEffect = t), t;
  }
  function Mm() {
    return Xt().memoizedState;
  }
  function es(t, e, n, i) {
    var u = ye();
    lt.flags |= t, u.memoizedState = Ea(
      1 | e,
      { destroy: void 0 },
      n,
      i === void 0 ? null : i
    );
  }
  function ns(t, e, n, i) {
    var u = Xt();
    i = i === void 0 ? null : i;
    var s = u.memoizedState.inst;
    Ot !== null && i !== null && Dr(i, Ot.memoizedState.deps) ? u.memoizedState = Ea(e, s, n, i) : (lt.flags |= t, u.memoizedState = Ea(
      1 | e,
      s,
      n,
      i
    ));
  }
  function xm(t, e) {
    es(8390656, 8, t, e);
  }
  function Ur(t, e) {
    ns(2048, 8, t, e);
  }
  function FS(t) {
    lt.flags |= 4;
    var e = lt.updateQueue;
    if (e === null)
      e = Iu(), lt.updateQueue = e, e.events = [t];
    else {
      var n = e.events;
      n === null ? e.events = [t] : n.push(t);
    }
  }
  function Cm(t) {
    var e = Xt().memoizedState;
    return FS({ ref: e, nextImpl: t }), function() {
      if ((At & 2) !== 0) throw Error(r(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function Om(t, e) {
    return ns(4, 2, t, e);
  }
  function zm(t, e) {
    return ns(4, 4, t, e);
  }
  function Rm(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function() {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function _m(t, e, n) {
    n = n != null ? n.concat([t]) : null, ns(4, 4, Rm.bind(null, e, t), n);
  }
  function wr() {
  }
  function Nm(t, e) {
    var n = Xt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    return e !== null && Dr(e, i[1]) ? i[0] : (n.memoizedState = [t, e], t);
  }
  function Vm(t, e) {
    var n = Xt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    if (e !== null && Dr(e, i[1]))
      return i[0];
    if (i = t(), ji) {
      Jn(!0);
      try {
        t();
      } finally {
        Jn(!1);
      }
    }
    return n.memoizedState = [i, e], i;
  }
  function Br(t, e, n) {
    return n === void 0 || (Hn & 1073741824) !== 0 && (ht & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = Xy(), lt.lanes |= t, ci |= t, n);
  }
  function Um(t, e, n, i) {
    return _e(n, e) ? n : ai.current !== null ? (t = Br(t, n, i), _e(t, e) || (Kt = !0), t) : (Hn & 106) === 0 || (Hn & 1073741824) !== 0 && (ht & 261930) === 0 ? (Kt = !0, t.memoizedState = n) : (t = Xy(), lt.lanes |= t, ci |= t, e);
  }
  function wm(t, e, n, i, u) {
    var s = nt.p;
    nt.p = s !== 0 && 8 > s ? s : 8;
    var f = F.T, y = {};
    y.types = f !== null ? f.types : null, F.T = y, jr(t, !1, e, n);
    try {
      var T = u(), x = F.S;
      if (x !== null && x(y, T), T !== null && typeof T == "object" && typeof T.then == "function") {
        var z = QS(
          T,
          i
        );
        Ol(
          t,
          e,
          z,
          Be(t)
        );
      } else
        Ol(
          t,
          e,
          i,
          Be(t)
        );
    } catch (U) {
      Ol(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: U },
        Be()
      );
    } finally {
      nt.p = s, f !== null && y.types !== null && (f.types = y.types), F.T = f;
    }
  }
  function kS() {
  }
  function Hr(t, e, n, i) {
    if (t.tag !== 5) throw Error(r(476));
    var u = Bm(t).queue;
    wm(
      t,
      u,
      e,
      Cn,
      n === null ? kS : function() {
        return Hm(t), n(i);
      }
    );
  }
  function Bm(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: Cn,
      baseState: Cn,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ln,
        lastRenderedState: Cn
      },
      next: null
    };
    var n = {};
    return e.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ln,
        lastRenderedState: n
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function Hm(t) {
    var e = Bm(t);
    e.next === null && (e = t.alternate.memoizedState), Ol(
      t,
      e.next.queue,
      {},
      Be()
    );
  }
  function Lr() {
    return ae(Ga);
  }
  function Lm() {
    return Xt().memoizedState;
  }
  function jm() {
    return Xt().memoizedState;
  }
  function WS(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = Be();
          t = ni(n);
          var i = ii(e, t, n);
          i !== null && (xe(i, e, n), El(i, e, n)), e = { cache: hr() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function IS(t, e, n) {
    var i = Be();
    n = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, is(t) ? Gm(e, n) : (n = ir(t, e, n, i), n !== null && (xe(n, t, i), qm(n, e, i)));
  }
  function Ym(t, e, n) {
    var i = Be();
    Ol(t, e, n, i);
  }
  function Ol(t, e, n, i) {
    var u = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (is(t)) Gm(e, u);
    else {
      var s = t.alternate;
      if (t.lanes === 0 && (s === null || s.lanes === 0) && (s = e.lastRenderedReducer, s !== null))
        try {
          var f = e.lastRenderedState, y = s(f, n);
          if (u.hasEagerState = !0, u.eagerState = y, _e(y, f))
            return Uu(t, e, u, 0), Rt === null && Vu(), !1;
        } catch {
        }
      if (n = ir(t, e, u, i), n !== null)
        return xe(n, t, i), qm(n, e, i), !0;
    }
    return !1;
  }
  function jr(t, e, n, i) {
    if (i = {
      lane: 2,
      revertLane: zc(),
      gesture: null,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, is(t)) {
      if (e) throw Error(r(479));
    } else
      e = ir(
        t,
        n,
        i,
        2
      ), e !== null && xe(e, t, 2);
  }
  function is(t) {
    var e = t.alternate;
    return t === lt || e !== null && e === lt;
  }
  function Gm(t, e) {
    Ta = ku = !0;
    var n = t.pending;
    n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
  }
  function qm(t, e, n) {
    if ((n & 4194048) !== 0) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, Xh(t, n);
    }
  }
  var as = {
    readContext: ae,
    use: $u,
    useCallback: Gt,
    useContext: Gt,
    useEffect: Gt,
    useImperativeHandle: Gt,
    useLayoutEffect: Gt,
    useInsertionEffect: Gt,
    useMemo: Gt,
    useReducer: Gt,
    useRef: Gt,
    useState: Gt,
    useDebugValue: Gt,
    useDeferredValue: Gt,
    useTransition: Gt,
    useSyncExternalStore: Gt,
    useId: Gt,
    useHostTransitionStatus: Gt,
    useFormState: Gt,
    useActionState: Gt,
    useOptimistic: Gt,
    useMemoCache: Gt,
    useCacheRefresh: Gt,
    useEffectEvent: Gt
  }, Xm = {
    readContext: ae,
    use: $u,
    useCallback: function(t, e) {
      return ye().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: ae,
    useEffect: xm,
    useImperativeHandle: function(t, e, n) {
      n = n != null ? n.concat([t]) : null, es(
        4194308,
        4,
        Rm.bind(null, e, t),
        n
      );
    },
    useLayoutEffect: function(t, e) {
      return es(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      es(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var n = ye();
      e = e === void 0 ? null : e;
      var i = t();
      if (ji) {
        Jn(!0);
        try {
          t();
        } finally {
          Jn(!1);
        }
      }
      return n.memoizedState = [i, e], i;
    },
    useReducer: function(t, e, n) {
      var i = ye();
      if (n !== void 0) {
        var u = n(e);
        if (ji) {
          Jn(!0);
          try {
            n(e);
          } finally {
            Jn(!1);
          }
        }
      } else u = e;
      return i.memoizedState = i.baseState = u, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: u
      }, i.queue = t, t = t.dispatch = IS.bind(
        null,
        lt,
        t
      ), [i.memoizedState, t];
    },
    useRef: function(t) {
      var e = ye();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Nr(t);
      var e = t.queue, n = Ym.bind(null, lt, e);
      return e.dispatch = n, [t.memoizedState, n];
    },
    useDebugValue: wr,
    useDeferredValue: function(t, e) {
      var n = ye();
      return Br(n, t, e);
    },
    useTransition: function() {
      var t = Nr(!1);
      return t = wm.bind(
        null,
        lt,
        t.queue,
        !0,
        !1
      ), ye().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, n) {
      var i = lt, u = ye();
      if (st) {
        if (n === void 0)
          throw Error(r(407));
        n = n();
      } else {
        if (n = e(), Rt === null)
          throw Error(r(349));
        (ht & 127) !== 0 || cm(i, e, n);
      }
      u.memoizedState = n;
      var s = { value: n, getSnapshot: e };
      return u.queue = s, xm(hm.bind(null, i, s, t), [
        t
      ]), i.flags |= 2048, Ea(
        9,
        { destroy: void 0 },
        fm.bind(
          null,
          i,
          s,
          n,
          e
        ),
        null
      ), n;
    },
    useId: function() {
      var t = ye(), e = Rt.identifierPrefix;
      if (st) {
        var n = hn, i = fn;
        n = (i & ~(1 << 32 - ze(i) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = Wu++, 0 < n && (e += "H" + n.toString(32)), e += "_";
      } else
        n = ZS++, e = "_" + e + "r_" + n.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Lr,
    useFormState: bm,
    useActionState: bm,
    useOptimistic: function(t) {
      var e = ye();
      e.memoizedState = e.baseState = t;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = n, e = jr.bind(
        null,
        lt,
        !0,
        n
      ), n.dispatch = e, [t, e];
    },
    useMemoCache: zr,
    useCacheRefresh: function() {
      return ye().memoizedState = WS.bind(
        null,
        lt
      );
    },
    useEffectEvent: function(t) {
      var e = ye(), n = { impl: t };
      return e.memoizedState = n, function() {
        if ((At & 2) !== 0)
          throw Error(r(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Qm = {
    readContext: ae,
    use: $u,
    useCallback: Nm,
    useContext: ae,
    useEffect: Ur,
    useImperativeHandle: _m,
    useInsertionEffect: Om,
    useLayoutEffect: zm,
    useMemo: Vm,
    useReducer: ts,
    useRef: Mm,
    useState: function() {
      return ts(Ln);
    },
    useDebugValue: wr,
    useDeferredValue: function(t, e) {
      var n = Xt();
      return Um(
        n,
        Ot.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = ts(Ln)[0], e = Xt().memoizedState;
      return [
        typeof t == "boolean" ? t : Cl(t),
        e
      ];
    },
    useSyncExternalStore: rm,
    useId: Lm,
    useHostTransitionStatus: Lr,
    useFormState: Em,
    useActionState: Em,
    useOptimistic: function(t, e) {
      var n = Xt();
      return ym(n, Ot, t, e);
    },
    useMemoCache: zr,
    useCacheRefresh: jm,
    useEffectEvent: Cm
  }, $S = {
    readContext: ae,
    use: $u,
    useCallback: Nm,
    useContext: ae,
    useEffect: Ur,
    useImperativeHandle: _m,
    useInsertionEffect: Om,
    useLayoutEffect: zm,
    useMemo: Vm,
    useReducer: _r,
    useRef: Mm,
    useState: function() {
      return _r(Ln);
    },
    useDebugValue: wr,
    useDeferredValue: function(t, e) {
      var n = Xt();
      return Ot === null ? Br(n, t, e) : Um(
        n,
        Ot.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = _r(Ln)[0], e = Xt().memoizedState;
      return [
        typeof t == "boolean" ? t : Cl(t),
        e
      ];
    },
    useSyncExternalStore: rm,
    useId: Lm,
    useHostTransitionStatus: Lr,
    useFormState: Dm,
    useActionState: Dm,
    useOptimistic: function(t, e) {
      var n = Xt();
      return Ot !== null ? ym(n, Ot, t, e) : (n.baseState = t, [t, n.queue.dispatch]);
    },
    useMemoCache: zr,
    useCacheRefresh: jm,
    useEffectEvent: Cm
  };
  function Yr(t, e, n, i) {
    e = t.memoizedState, n = n(i, e), n = n == null ? e : w({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var Gr = {
    enqueueSetState: function(t, e, n) {
      t = t._reactInternals;
      var i = Be(), u = ni(i);
      u.payload = e, n != null && (u.callback = n), e = ii(t, u, i), e !== null && (xe(e, t, i), El(e, t, i));
    },
    enqueueReplaceState: function(t, e, n) {
      t = t._reactInternals;
      var i = Be(), u = ni(i);
      u.tag = 1, u.payload = e, n != null && (u.callback = n), e = ii(t, u, i), e !== null && (xe(e, t, i), El(e, t, i));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var n = Be(), i = ni(n);
      i.tag = 2, e != null && (i.callback = e), e = ii(t, i, n), e !== null && (xe(e, t, n), El(e, t, n));
    }
  };
  function Zm(t, e, n, i, u, s, f) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(i, s, f) : e.prototype && e.prototype.isPureReactComponent ? !ml(n, i) || !ml(u, s) : !0;
  }
  function Km(t, e, n, i) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, i), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, i), e.state !== t && Gr.enqueueReplaceState(e, e.state, null);
  }
  function Yi(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var i in e)
        i !== "ref" && (n[i] = e[i]);
    }
    if (t = t.defaultProps) {
      n === e && (n = w({}, n));
      for (var u in t)
        n[u] === void 0 && (n[u] = t[u]);
    }
    return n;
  }
  function Jm(t) {
    Nu(t);
  }
  function Pm(t) {
    console.error(t);
  }
  function Fm(t) {
    Nu(t);
  }
  function ls(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function km(t, e, n) {
    try {
      var i = t.onCaughtError;
      i(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function qr(t, e, n) {
    return n = ni(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      ls(t, e);
    }, n;
  }
  function Wm(t) {
    return t = ni(t), t.tag = 3, t;
  }
  function Im(t, e, n, i) {
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var s = i.value;
      t.payload = function() {
        return u(s);
      }, t.callback = function() {
        km(e, n, i);
      };
    }
    var f = n.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (t.callback = function() {
      km(e, n, i), typeof u != "function" && (fi === null ? fi = /* @__PURE__ */ new Set([this]) : fi.add(this));
      var y = i.stack;
      this.componentDidCatch(i.value, {
        componentStack: y !== null ? y : ""
      });
    });
  }
  function tT(t, e, n, i, u) {
    if (n.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
      if (e = n.alternate, e !== null && Ni(
        e,
        n,
        u,
        !0
      ), n = le.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
          case 19:
            return de === null ? xs() : n.alternate === null && qt === 0 && (qt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = u, i === Zu ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([i]) : e.add(i), xc(t, i, u)), !1;
          case 22:
            return n.flags |= 65536, i === Zu ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([i])
            }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([i]) : n.add(i)), xc(t, i, u)), !1;
        }
        throw Error(r(435, n.tag));
      }
      return xc(t, i, u), xs(), !1;
    }
    if (st)
      return e = le.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = u, i !== or && (t = Error(r(422), { cause: i }), vl(qe(t, n)))) : (i !== or && (e = Error(r(423), {
        cause: i
      }), vl(
        qe(e, n)
      )), t = t.current.alternate, t.flags |= 65536, u &= -u, t.lanes |= u, i = qe(i, n), u = qr(
        t.stateNode,
        i,
        u
      ), pr(t, u), qt !== 4 && (qt = 2)), !1;
    var s = Error(r(520), { cause: i });
    if (s = qe(s, n), Bl === null ? Bl = [s] : Bl.push(s), qt !== 4 && (qt = 2), e === null) return !0;
    i = qe(i, n), n = e;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, t = u & -u, n.lanes |= t, t = qr(n.stateNode, i, t), pr(n, t), !1;
        case 1:
          if (e = n.type, s = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (fi === null || !fi.has(s))))
            return n.flags |= 65536, u &= -u, n.lanes |= u, u = Wm(u), Im(
              u,
              t,
              n,
              i
            ), pr(n, u), !1;
          break;
        case 22:
          if (n.memoizedState !== null)
            return n.flags |= 65536, !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Xr = Error(r(461)), Kt = !1;
  function Ft(t, e, n, i) {
    e.child = t === null ? nm(e, null, n, i) : Li(
      e,
      t.child,
      n,
      i
    );
  }
  function $m(t, e, n, i, u) {
    n = n.render;
    var s = e.ref;
    if ("ref" in i) {
      var f = {};
      for (var y in i)
        y !== "ref" && (f[y] = i[y]);
    } else f = i;
    return Vi(e), i = Mr(
      t,
      e,
      n,
      f,
      s,
      u
    ), y = xr(), t !== null && !Kt ? (Cr(t, e, u), jn(t, e, u)) : (st && y && Lu(e), e.flags |= 1, Ft(t, e, i, u), e.child);
  }
  function ty(t, e, n, i, u) {
    if (t === null) {
      var s = n.type;
      return typeof s == "function" && !ar(s) && s.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = s, ey(
        t,
        e,
        s,
        i,
        u
      )) : (t = Bu(
        n.type,
        null,
        i,
        e,
        e.mode,
        u
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (s = t.child, !Wr(t, u)) {
      var f = s.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ml, n(f, i) && t.ref === e.ref)
        return jn(t, e, u);
    }
    return e.flags |= 1, t = Vn(s, i), t.ref = e.ref, t.return = e, e.child = t;
  }
  function ey(t, e, n, i, u) {
    if (t !== null) {
      var s = t.memoizedProps;
      if (ml(s, i) && t.ref === e.ref)
        if (Kt = !1, e.pendingProps = i = s, Wr(t, u))
          (t.flags & 131072) !== 0 && (Kt = !0);
        else
          return e.lanes = t.lanes, jn(t, e, u);
    }
    return Qr(
      t,
      e,
      n,
      i,
      u
    );
  }
  function ny(t, e, n, i) {
    var u = i.children, s = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), i.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (s = s !== null ? s.baseLanes | n : n, t !== null) {
          for (i = e.child = t.child, u = 0; i !== null; )
            u = u | i.lanes | i.childLanes, i = i.sibling;
          i = u & ~s;
        } else i = 0, e.child = null;
        return iy(
          t,
          e,
          s,
          n,
          i
        );
      }
      if ((n & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && Xu(
          e,
          s !== null ? s.cachePool : null
        ), s !== null ? lm(e, s) : Tr(), um(e);
      else
        return i = e.lanes = 536870912, iy(
          t,
          e,
          s !== null ? s.baseLanes | n : n,
          n,
          i
        );
    } else
      s !== null ? (Xu(e, s.cachePool), lm(e, s), ui(), e.memoizedState = null) : (t !== null && Xu(e, null), Tr(), ui());
    return Ft(t, e, u, n), e.child;
  }
  function zl(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function iy(t, e, n, i, u) {
    var s = mr();
    return s = s === null ? null : { parent: Qt._currentValue, pool: s }, e.memoizedState = {
      baseLanes: n,
      cachePool: s
    }, t !== null && Xu(e, null), Tr(), um(e), t !== null && Ni(t, e, i, !0), e.childLanes = u, null;
  }
  function us(t, e) {
    return e = ss(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function ay(t, e, n) {
    return Li(e, t.child, null, n), t = us(e, e.pendingProps), t.flags |= 2, Ne(e), e.memoizedState = null, t;
  }
  function eT(t, e, n) {
    var i = e.pendingProps, u = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (st) {
        if (i.mode === "hidden")
          return t = us(e, i), e.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, zl(null, t);
        if (Er(e), (t = Nt) ? (t = Rg(
          t,
          Ze
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: kn !== null ? { id: fn, overflow: hn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Gd(t), n.return = e, e.child = n, $t = e, Nt = null)) : t = null, t === null) throw In(e);
        return e.lanes = 536870912, null;
      }
      return us(e, i);
    }
    var s = t.memoizedState;
    if (s !== null) {
      var f = s.dehydrated;
      if (Er(e), u)
        if (e.flags & 256)
          e.flags &= -257, e = ay(
            t,
            e,
            n
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(r(558));
      else if (Kt || Ni(t, e, n, !1), u = (n & t.childLanes) !== 0, Kt || u) {
        if (ai.current === null) {
          if (i = Rt, i !== null && (f = Qh(i, n), f !== 0 && f !== s.retryLane))
            throw s.retryLane = f, Oi(t, f), xe(i, t, f), Xr;
          xs();
        }
        e = ay(
          t,
          e,
          n
        );
      } else
        t = s.treeContext, Nt = Je(f.nextSibling), $t = e, st = !0, Wn = null, Ze = !1, t !== null && Qd(e, t), e = us(e, i), e.flags |= 134221824;
      return e;
    }
    return t = Vn(t.child, {
      mode: i.mode,
      children: i.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Aa(t, e) {
    var n = e.ref;
    if (n === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(r(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function Qr(t, e, n, i, u) {
    return Vi(e), n = Mr(
      t,
      e,
      n,
      i,
      void 0,
      u
    ), i = xr(), t !== null && !Kt ? (Cr(t, e, u), jn(t, e, u)) : (st && i && Lu(e), e.flags |= 1, Ft(t, e, n, u), e.child);
  }
  function ly(t, e, n, i, u, s) {
    return Vi(e), e.updateQueue = null, n = om(
      e,
      i,
      n,
      u
    ), sm(t), i = xr(), t !== null && !Kt ? (Cr(t, e, s), jn(t, e, s)) : (st && i && Lu(e), e.flags |= 1, Ft(t, e, n, s), e.child);
  }
  function uy(t, e, n, i, u) {
    if (Vi(e), e.stateNode === null) {
      var s = da, f = n.contextType;
      typeof f == "object" && f !== null && (s = ae(f)), s = new n(i, s), e.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, s.updater = Gr, e.stateNode = s, s._reactInternals = e, s = e.stateNode, s.props = i, s.state = e.memoizedState, s.refs = {}, gr(e), f = n.contextType, s.context = typeof f == "object" && f !== null ? ae(f) : da, s.state = e.memoizedState, f = n.getDerivedStateFromProps, typeof f == "function" && (Yr(
        e,
        n,
        f,
        i
      ), s.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (f = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), f !== s.state && Gr.enqueueReplaceState(s, s.state, null), Dl(e, i, s, u), Al(), s.state = e.memoizedState), typeof s.componentDidMount == "function" && (e.flags |= 4194308), i = !0;
    } else if (t === null) {
      s = e.stateNode;
      var y = e.memoizedProps, T = Yi(n, y);
      s.props = T;
      var x = s.context, z = n.contextType;
      f = da, typeof z == "object" && z !== null && (f = ae(z));
      var U = n.getDerivedStateFromProps;
      z = typeof U == "function" || typeof s.getSnapshotBeforeUpdate == "function", y = e.pendingProps !== y, z || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (y || x !== f) && Km(
        e,
        s,
        i,
        f
      ), ei = !1;
      var D = e.memoizedState;
      s.state = D, Dl(e, i, s, u), Al(), x = e.memoizedState, y || D !== x || ei ? (typeof U == "function" && (Yr(
        e,
        n,
        U,
        i
      ), x = e.memoizedState), (T = ei || Zm(
        e,
        n,
        T,
        i,
        D,
        x,
        f
      )) ? (z || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = i, e.memoizedState = x), s.props = i, s.state = x, s.context = f, i = T) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), i = !1);
    } else {
      s = e.stateNode, vr(t, e), f = e.memoizedProps, z = Yi(n, f), s.props = z, U = e.pendingProps, D = s.context, x = n.contextType, T = da, typeof x == "object" && x !== null && (T = ae(x)), y = n.getDerivedStateFromProps, (x = typeof y == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (f !== U || D !== T) && Km(
        e,
        s,
        i,
        T
      ), ei = !1, D = e.memoizedState, s.state = D, Dl(e, i, s, u), Al();
      var O = e.memoizedState;
      f !== U || D !== O || ei || t !== null && t.dependencies !== null && Gu(t.dependencies) ? (typeof y == "function" && (Yr(
        e,
        n,
        y,
        i
      ), O = e.memoizedState), (z = ei || Zm(
        e,
        n,
        z,
        i,
        D,
        O,
        T
      ) || t !== null && t.dependencies !== null && Gu(t.dependencies)) ? (x || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, O, T), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(
        i,
        O,
        T
      )), typeof s.componentDidUpdate == "function" && (e.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || f === t.memoizedProps && D === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || f === t.memoizedProps && D === t.memoizedState || (e.flags |= 1024), e.memoizedProps = i, e.memoizedState = O), s.props = i, s.state = O, s.context = T, i = z) : (typeof s.componentDidUpdate != "function" || f === t.memoizedProps && D === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || f === t.memoizedProps && D === t.memoizedState || (e.flags |= 1024), i = !1);
    }
    return s = i, Aa(t, e), i = (e.flags & 128) !== 0, s || i ? (s = e.stateNode, n = i && typeof n.getDerivedStateFromError != "function" ? null : s.render(), e.flags |= 1, t !== null && i ? (e.child = Li(
      e,
      t.child,
      null,
      u
    ), e.child = Li(
      e,
      null,
      n,
      u
    )) : Ft(t, e, n, u), e.memoizedState = s.state, t = e.child) : t = jn(
      t,
      e,
      u
    ), t;
  }
  function sy(t, e, n, i) {
    return Ri(), e.flags |= 256, Ft(t, e, n, i), e.child;
  }
  var Zr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Kr(t) {
    return { baseLanes: t, cachePool: kd() };
  }
  function Jr(t, e, n) {
    return t = t !== null ? t.childLanes & ~n : 0, e && (t |= we), t;
  }
  function oy(t, e, n) {
    var i = e.pendingProps, u = !1, s = (e.flags & 128) !== 0, f;
    if ((f = s) || (f = t !== null && t.memoizedState === null ? !1 : (ue.current & 2) !== 0), f && (u = !0, e.flags &= -129), f = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (st) {
        if (u ? li(e) : ui(), (t = Nt) ? (t = Rg(
          t,
          Ze
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: kn !== null ? { id: fn, overflow: hn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Gd(t), n.return = e, e.child = n, $t = e, Nt = null)) : t = null, t === null) throw In(e);
        return Kc(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      return s = i.children, i = i.fallback, u ? (ui(), u = e.mode, s = ss(
        { mode: "hidden", children: s },
        u
      ), i = zi(
        i,
        u,
        n,
        null
      ), s.return = e, i.return = e, s.sibling = i, e.child = s, i = e.child, i.memoizedState = Kr(n), i.childLanes = Jr(
        t,
        f,
        n
      ), e.memoizedState = Zr, zl(null, i)) : (li(e), Pr(e, s));
    }
    var y = t.memoizedState;
    if (y !== null) {
      var T = y.dehydrated;
      if (T !== null)
        return nT(
          t,
          e,
          s,
          f,
          i,
          T,
          y,
          n
        );
    }
    return u ? (ui(), u = i.fallback, s = e.mode, y = t.child, T = y.sibling, i = Vn(y, {
      mode: "hidden",
      children: i.children
    }), i.subtreeFlags = y.subtreeFlags & 1206910976, T !== null ? u = Vn(T, u) : (u = zi(
      u,
      s,
      n,
      null
    ), u.flags |= 2), u.return = e, i.return = e, i.sibling = u, e.child = i, zl(null, i), i = e.child, u = t.child.memoizedState, u === null ? u = Kr(n) : (s = u.cachePool, s !== null ? (y = Qt._currentValue, s = s.parent !== y ? { parent: y, pool: y } : s) : s = kd(), u = {
      baseLanes: u.baseLanes | n,
      cachePool: s
    }), i.memoizedState = u, i.childLanes = Jr(
      t,
      f,
      n
    ), e.memoizedState = Zr, zl(t.child, i)) : (li(e), n = t.child, t = n.sibling, n = Vn(n, {
      mode: "visible",
      children: i.children
    }), n.return = e, n.sibling = null, t !== null && (f = e.deletions, f === null ? (e.deletions = [t], e.flags |= 16) : f.push(t)), e.child = n, e.memoizedState = null, n);
  }
  function Pr(t, e) {
    return e = ss(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function ss(t, e) {
    return t = Ee(22, t, null, e), t.lanes = 0, t;
  }
  function os(t, e, n) {
    return Li(e, t.child, null, n), t = Pr(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function nT(t, e, n, i, u, s, f, y) {
    if (n)
      return e.flags & 256 ? (li(e), e.flags &= -257, os(
        t,
        e,
        y
      )) : e.memoizedState !== null ? (ui(), e.child = t.child, e.flags |= 128, null) : (ui(), s = u.fallback, f = e.mode, u = ss(
        { mode: "visible", children: u.children },
        f
      ), s = zi(
        s,
        f,
        y,
        null
      ), s.flags |= 2, u.return = e, s.return = e, u.sibling = s, e.child = u, Li(e, t.child, null, y), u = e.child, u.memoizedState = Kr(y), u.childLanes = Jr(
        t,
        i,
        y
      ), e.memoizedState = Zr, zl(null, u));
    if (li(e), Kc(s)) {
      if (i = s.nextSibling && s.nextSibling.dataset, i) var T = i.dgst;
      return i = T, i !== "" && (u = Error(r(419)), u.stack = "", u.digest = i, vl({ value: u, source: null, stack: null })), os(
        t,
        e,
        y
      );
    }
    if (Kt || Ni(t, e, y, !1), i = (y & t.childLanes) !== 0, Kt || i) {
      if (ai.current !== null)
        return os(
          t,
          e,
          y
        );
      if (i = Rt, i !== null && (u = Qh(
        i,
        y
      ), u !== 0 && u !== f.retryLane))
        throw f.retryLane = u, Oi(t, u), xe(i, t, u), Xr;
      return Zc(s) || xs(), os(
        t,
        e,
        y
      );
    }
    return Zc(s) ? (e.flags |= 192, e.child = t.child, null) : (t = f.treeContext, Nt = Je(s.nextSibling), $t = e, st = !0, Wn = null, Ze = !1, t !== null && Qd(e, t), e = Pr(
      e,
      u.children
    ), e.flags |= 134221824, e);
  }
  function ry(t, e, n) {
    t.lanes |= e;
    var i = t.alternate;
    i !== null && (i.lanes |= e), Yu(t.return, e, n);
  }
  function cy(t) {
    for (var e = null; t !== null; ) {
      var n = t.alternate;
      n !== null && Fu(n) === null && (e = t), t = t.sibling;
    }
    return e;
  }
  function rs(t, e, n, i, u, s) {
    var f = t.memoizedState;
    f === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: i,
      tail: n,
      tailMode: u,
      treeForkCount: s
    } : (f.isBackwards = e, f.rendering = null, f.renderingStartTime = 0, f.last = i, f.tail = n, f.tailMode = u, f.treeForkCount = s);
  }
  function Fr(t) {
    var e = t.child;
    for (t.child = null; e !== null; ) {
      var n = e.sibling;
      e.sibling = t.child, t.child = e, e = n;
    }
  }
  function kr(t, e, n) {
    var i = e.pendingProps, u = i.revealOrder, s = i.tail;
    i = i.children;
    var f = ue.current;
    if (e.flags & 128)
      return Ml(e, f), null;
    var y = (f & 2) !== 0;
    if (y ? (f = f & 1 | 2, e.flags |= 128) : f &= 1, Ml(e, f), u === "backwards" && t !== null ? (Fr(t), Ft(t, e, i, n), Fr(t)) : Ft(t, e, i, n), i = st ? gl : 0, !y && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && ry(t, n, e);
        else if (t.tag === 19)
          ry(t, n, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (u) {
      case "backwards":
        n = cy(e.child), n === null ? (u = e.child, e.child = null) : (u = n.sibling, n.sibling = null, Fr(e)), rs(
          e,
          !0,
          u,
          null,
          s,
          i
        );
        break;
      case "unstable_legacy-backwards":
        for (n = null, u = e.child, e.child = null; u !== null; ) {
          if (t = u.alternate, t !== null && Fu(t) === null) {
            e.child = u;
            break;
          }
          t = u.sibling, u.sibling = n, n = u, u = t;
        }
        rs(
          e,
          !0,
          n,
          null,
          s,
          i
        );
        break;
      case "together":
        rs(
          e,
          !1,
          null,
          null,
          void 0,
          i
        );
        break;
      case "independent":
        e.memoizedState = null;
        break;
      default:
        n = cy(e.child), n === null ? (u = e.child, e.child = null) : (u = n.sibling, n.sibling = null), rs(
          e,
          !1,
          u,
          n,
          s,
          i
        );
    }
    return e.child;
  }
  function fy(t, e, n) {
    var i = e.pendingProps;
    return $n(e, e.type, i.value), Ft(t, e, i.children, n), e.child;
  }
  function jn(t, e, n) {
    if (t !== null && (e.dependencies = t.dependencies), ci |= e.lanes, (n & e.childLanes) === 0)
      if (t !== null) {
        if (Ni(
          t,
          e,
          n,
          !1
        ), (n & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(r(153));
    if (e.child !== null) {
      for (t = e.child, n = Vn(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
        t = t.sibling, n = n.sibling = Vn(t, t.pendingProps), n.return = e;
      n.sibling = null;
    }
    return e.child;
  }
  function Wr(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && Gu(t)));
  }
  function iT(t, e, n) {
    switch (e.tag) {
      case 3:
        mu(e, e.stateNode.containerInfo), $n(e, Qt, t.memoizedState.cache), Ri();
        break;
      case 27:
      case 5:
        Do(e);
        break;
      case 4:
        mu(e, e.stateNode.containerInfo);
        break;
      case 10:
        $n(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, Er(e), null;
        break;
      case 13:
        var i = e.memoizedState;
        if (i !== null) {
          if (i.dehydrated !== null)
            return li(e), e.flags |= 128, null;
          i = Ni(
            t,
            e,
            n,
            !1
          );
          var u = e.child.childLanes;
          return i || (n & u) !== 0 ? oy(t, e, n) : (li(e), t = jn(
            t,
            e,
            n
          ), t !== null ? t.sibling : null);
        }
        li(e);
        break;
      case 19:
        if (e.flags & 128)
          return kr(
            t,
            e,
            n
          );
        if (u = (t.flags & 128) !== 0, i = (n & e.childLanes) !== 0, i || (Ni(
          t,
          e,
          n,
          !1
        ), i = (n & e.childLanes) !== 0), u) {
          if (i)
            return kr(
              t,
              e,
              n
            );
          e.flags |= 128;
        }
        if (u = e.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Ml(e, ue.current), i) break;
        return null;
      case 22:
        return e.lanes = 0, ny(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        $n(e, Qt, t.memoizedState.cache);
    }
    return jn(t, e, n);
  }
  function hy(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Kt = !0;
      else {
        if (!Wr(t, n) && (e.flags & 128) === 0)
          return Kt = !1, iT(
            t,
            e,
            n
          );
        Kt = (t.flags & 131072) !== 0;
      }
    else
      Kt = !1, st && (e.flags & 1048576) !== 0 && Xd(e, gl, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var i = e.pendingProps;
          if (t = Bi(e.elementType), e.type = t, typeof t == "function")
            ar(t) ? (i = Yi(t, i), e.tag = 1, e = uy(
              null,
              e,
              t,
              i,
              n
            )) : (e.tag = 0, e = Qr(
              null,
              e,
              t,
              i,
              n
            ));
          else {
            if (t != null) {
              var u = t.$$typeof;
              if (u === G) {
                e.tag = 11, e = $m(
                  null,
                  e,
                  t,
                  i,
                  n
                );
                break t;
              } else if (u === mt) {
                e.tag = 14, e = ty(
                  null,
                  e,
                  t,
                  i,
                  n
                );
                break t;
              } else if (u === wt) {
                e.tag = 10, e.type = t, e = fy(
                  null,
                  e,
                  n
                );
                break t;
              }
            }
            throw e = St(t) || t, Error(r(306, e, ""));
          }
        }
        return e;
      case 0:
        return Qr(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 1:
        return i = e.type, u = Yi(
          i,
          e.pendingProps
        ), uy(
          t,
          e,
          i,
          u,
          n
        );
      case 3:
        t: {
          if (mu(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(r(387));
          i = e.pendingProps;
          var s = e.memoizedState;
          u = s.element, vr(t, e), Dl(e, i, null, n);
          var f = e.memoizedState;
          if (i = f.cache, $n(e, Qt, i), i !== s.cache && fr(
            e,
            [Qt],
            n,
            !0
          ), Al(), i = f.element, s.isDehydrated)
            if (s = {
              element: i,
              isDehydrated: !1,
              cache: f.cache
            }, e.updateQueue.baseState = s, e.memoizedState = s, e.flags & 256) {
              e = sy(
                t,
                e,
                i,
                n
              );
              break t;
            } else if (i !== u) {
              u = qe(
                Error(r(424)),
                e
              ), vl(u), e = sy(
                t,
                e,
                i,
                n
              );
              break t;
            } else
              for (t = e.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, Nt = Je(t.firstChild), $t = e, st = !0, Wn = null, Ze = !0, n = nm(
                e,
                null,
                i,
                n
              ), e.child = n; n; )
                n.flags = n.flags & -3 | 134221824, n = n.sibling;
          else {
            if (Ri(), i === u) {
              e = jn(
                t,
                e,
                n
              );
              break t;
            }
            Ft(t, e, i, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return Aa(t, e), t === null ? (n = Hg(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = n : st || (e.stateNode = gg(
          e.type,
          e.pendingProps,
          Zn.current,
          e
        )) : e.memoizedState = Hg(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return Do(e), t === null && st && (i = e.stateNode = Vg(
          e.type,
          e.pendingProps,
          Zn.current
        ), $t = e, Ze = !0, u = Nt, mi(e.type) ? (Jc = u, Nt = Je(i.firstChild)) : Nt = u), Ft(
          t,
          e,
          e.pendingProps.children,
          n
        ), Aa(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && st && ((u = i = Nt) && (i = WT(
          i,
          e.type,
          e.pendingProps,
          Ze
        ), i !== null ? (e.stateNode = i, $t = e, Nt = Je(i.firstChild), Ze = !1, u = !0) : u = !1), u || In(e)), Do(e), u = e.type, s = e.pendingProps, f = t !== null ? t.memoizedProps : null, i = s.children, Lc(u, s) ? i = null : f !== null && Lc(u, f) && (e.flags |= 32), e.memoizedState !== null && (u = Mr(
          t,
          e,
          KS,
          null,
          null,
          n
        ), Ga._currentValue = u), Aa(t, e), Ft(t, e, i, n), e.child;
      case 6:
        return t === null && st && ((t = n = Nt) && (n = IT(
          n,
          e.pendingProps,
          Ze
        ), n !== null ? (e.stateNode = n, $t = e, Nt = null, t = !0) : t = !1), t || In(e)), null;
      case 13:
        return oy(t, e, n);
      case 4:
        return mu(
          e,
          e.stateNode.containerInfo
        ), i = e.pendingProps, t === null ? e.child = Li(
          e,
          null,
          i,
          n
        ) : Ft(t, e, i, n), e.child;
      case 11:
        return $m(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 7:
        return i = e.pendingProps, Aa(t, e), Ft(t, e, i, n), e.child;
      case 8:
        return Ft(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 12:
        return Ft(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 10:
        return fy(t, e, n);
      case 9:
        return u = e.type._context, i = e.pendingProps.children, Vi(e), u = ae(u), i = i(u), e.flags |= 1, Ft(t, e, i, n), e.child;
      case 14:
        return ty(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 15:
        return ey(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 19:
        return kr(t, e, n);
      case 31:
        return eT(t, e, n);
      case 22:
        return ny(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        return Vi(e), i = ae(Qt), t === null ? (u = mr(), u === null && (u = Rt, s = hr(), u.pooledCache = s, s.refCount++, s !== null && (u.pooledCacheLanes |= n), u = s), e.memoizedState = { parent: i, cache: u }, gr(e), $n(e, Qt, u)) : ((t.lanes & n) !== 0 && (vr(t, e), Dl(e, null, null, n), Al()), u = t.memoizedState, s = e.memoizedState, u.parent !== i ? (u = { parent: i, cache: i }, e.memoizedState = u, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = u), $n(e, Qt, i)) : (i = s.cache, $n(e, Qt, i), i !== u.cache && fr(
          e,
          [Qt],
          n,
          !0
        ))), Ft(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 30:
        return e.stateNode === null && (e.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), i = e.pendingProps, i.name != null && i.name !== "auto" ? e.flags |= t === null ? 18882560 : 18874368 : st && Lu(e), t !== null && t.memoizedProps.name !== i.name ? e.flags |= 4194816 : Aa(t, e), Ft(t, e, i.children, n), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(r(156, e.tag));
  }
  function Yn(t) {
    t.flags |= 4;
  }
  function Ir(t, e, n, i, u) {
    var s;
    if ((s = (t.mode & 32) !== 0) && (s = n === null ? Gg(e, i) : Gg(e, i) && (i.src !== n.src || i.srcSet !== n.srcSet)), s) {
      if (t.flags |= 16777216, (u & 335544128) === u)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (Jy()) t.flags |= 8192;
        else
          throw Hi = Zu, yr;
    } else t.flags &= -16777217;
  }
  function dy(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !qg(e))
      if (Jy()) t.flags |= 8192;
      else
        throw Hi = Zu, yr;
  }
  function cs(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Gh() : 536870912, t.lanes |= e, Oa |= e);
  }
  function Rl(t, e) {
    if (!st)
      switch (t.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var n = t.tail, i = null; n !== null; )
            n.alternate !== null && (i = n), n = n.sibling;
          i === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : i.sibling = null;
          break;
        default:
          for (e = t.tail, n = null; e !== null; )
            e.alternate !== null && (n = e), e = e.sibling;
          n === null ? t.tail = null : n.sibling = null;
      }
  }
  function Vt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, n = 0, i = 0;
    if (e)
      for (var u = t.child; u !== null; )
        n |= u.lanes | u.childLanes, i |= u.subtreeFlags & 1206910976, i |= u.flags & 1206910976, u.return = t, u = u.sibling;
    else
      for (u = t.child; u !== null; )
        n |= u.lanes | u.childLanes, i |= u.subtreeFlags, i |= u.flags, u.return = t, u = u.sibling;
    return t.subtreeFlags |= i, t.childLanes = n, e;
  }
  function aT(t, e, n) {
    var i = e.pendingProps;
    switch (sr(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Vt(e), null;
      case 1:
        return Vt(e), null;
      case 3:
        return n = e.stateNode, i = null, t !== null && (i = t.memoizedState.cache), e.memoizedState.cache !== i && (e.flags |= 2048), Bn(Qt), ta(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (ga(e) ? Yn(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, rr())), Vt(e), null;
      case 26:
        var u = e.type, s = e.memoizedState;
        return t === null ? (Yn(e), s !== null ? (Vt(e), dy(e, s)) : (Vt(e), Ir(
          e,
          u,
          null,
          i,
          n
        ))) : s ? s !== t.memoizedState ? (Yn(e), Vt(e), dy(e, s)) : (Vt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== i && Yn(e), Vt(e), Ir(
          e,
          u,
          t,
          i,
          n
        )), null;
      case 27:
        if (yu(e), n = Zn.current, u = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== i && Yn(e);
        else {
          if (!i) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Vt(e), e.subtreeFlags &= -33554433, null;
          }
          t = rn.current, ga(e) ? Zd(e) : (t = Vg(u, i, n), e.stateNode = t, Yn(e));
        }
        return Vt(e), e.subtreeFlags &= -33554433, null;
      case 5:
        if (yu(e), u = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== i && Yn(e);
        else {
          if (!i) {
            if (e.stateNode === null)
              throw Error(r(166));
            return Vt(e), e.subtreeFlags &= -33554433, null;
          }
          if (s = rn.current, ga(e))
            Zd(e);
          else {
            var f = Gl(
              Zn.current
            );
            switch (s) {
              case 1:
                s = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                s = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    s = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    s = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    s = f.createElement("div"), s.innerHTML = "<script><\/script>", s = s.removeChild(
                      s.firstChild
                    );
                    break;
                  case "select":
                    s = typeof i.is == "string" ? f.createElement("select", {
                      is: i.is
                    }) : f.createElement("select"), i.multiple ? s.multiple = !0 : i.size && (s.size = i.size);
                    break;
                  default:
                    s = typeof i.is == "string" ? f.createElement(u, { is: i.is }) : f.createElement(u);
                }
            }
            s[ie] = e, s[be] = i;
            t: for (f = e.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                s.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === e) break t;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === e)
                  break t;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            e.stateNode = s;
            t: switch (oe(s, u, i), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                i = !!i.autoFocus;
                break t;
              case "img":
                i = !0;
                break t;
              default:
                i = !1;
            }
            i && Yn(e);
          }
        }
        return Vt(e), e.subtreeFlags &= -33554433, Ir(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          n
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== i && Yn(e);
        else {
          if (typeof i != "string" && e.stateNode === null)
            throw Error(r(166));
          if (t = Zn.current, ga(e)) {
            if (t = e.stateNode, n = e.memoizedProps, i = null, u = $t, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  i = u.memoizedProps;
              }
            t[ie] = e, t = !!(t.nodeValue === n || i !== null && i.suppressHydrationWarning === !0 || hg(t.nodeValue, n)), t || In(e, !0);
          } else
            t = Gl(t).createTextNode(
              i
            ), t[ie] = e, e.stateNode = t;
        }
        return Vt(e), null;
      case 31:
        if (n = e.memoizedState, t === null || t.memoizedState !== null) {
          if (i = ga(e), n !== null) {
            if (t === null) {
              if (!i) throw Error(r(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(557));
              t[ie] = e;
            } else
              Ri(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Vt(e), t = !1;
          } else
            n = rr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = !0;
          if (!t)
            return e.flags & 256 ? (Ne(e), e) : (Ne(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(r(558));
        }
        return Vt(e), null;
      case 13:
        if (i = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (u = ga(e), i !== null && i.dehydrated !== null) {
            if (t === null) {
              if (!u) throw Error(r(318));
              if (u = e.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(r(317));
              u[ie] = e;
            } else
              Ri(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Vt(e), u = !1;
          } else
            u = rr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return e.flags & 256 ? (Ne(e), e) : (Ne(e), null);
        }
        return Ne(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = i !== null, t = t !== null && t.memoizedState !== null, n && (i = e.child, u = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (u = i.alternate.memoizedState.cachePool.pool), s = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (s = i.memoizedState.cachePool.pool), s !== u && (i.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), cs(e, e.updateQueue), Vt(e), null);
      case 4:
        return ta(), t === null && Vc(e.stateNode.containerInfo), e.flags |= 67108864, Vt(e), null;
      case 10:
        return Bn(e.type), Vt(e), null;
      case 19:
        if (Ar(e), i = e.memoizedState, i === null) return Vt(e), null;
        if (u = (e.flags & 128) !== 0, s = i.rendering, s === null)
          if (u) Rl(i, !1);
          else {
            if (qt !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (s = Fu(t), s !== null) {
                  for (e.flags |= 128, Rl(i, !1), t = s.updateQueue, e.updateQueue = t, cs(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; )
                    Yd(n, t), n = n.sibling;
                  return Ml(
                    e,
                    ue.current & 1 | 2
                  ), st && Un(e, i.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            i.tail !== null && Ce() > Es && (e.flags |= 128, u = !0, Rl(i, !1), e.lanes = 4194304);
          }
        else {
          if (!u)
            if (t = Fu(s), t !== null) {
              if (e.flags |= 128, u = !0, t = t.updateQueue, e.updateQueue = t, cs(e, t), Rl(i, !0), i.tail === null && i.tailMode !== "collapsed" && i.tailMode !== "visible" && !s.alternate && !st)
                return Vt(e), null;
            } else
              2 * Ce() - i.renderingStartTime > Es && n !== 536870912 && (e.flags |= 128, u = !0, Rl(i, !1), e.lanes = 4194304);
          i.isBackwards ? (s.sibling = e.child, e.child = s) : (t = i.last, t !== null ? t.sibling = s : e.child = s, i.last = s);
        }
        if (i.tail !== null) {
          t = i.tail;
          t: {
            for (n = t; n !== null; ) {
              if (n.alternate !== null) {
                n = !1;
                break t;
              }
              n = n.sibling;
            }
            n = !0;
          }
          return i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Ce(), t.sibling = null, s = ue.current, s = u ? s & 1 | 2 : s & 1, i.tailMode === "visible" || i.tailMode === "collapsed" || !n || st ? Ml(e, s) : (n = s, _t(le, e), _t(ue, n), de === null && (de = e)), st && Un(e, i.treeForkCount), t;
        }
        return Vt(e), null;
      case 22:
      case 23:
        return Ne(e), br(), i = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== i && (e.flags |= 8192) : i && (e.flags |= 8192), i ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (Vt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Vt(e), n = e.updateQueue, n !== null && cs(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), i = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (i = e.memoizedState.cachePool.pool), i !== n && (e.flags |= 2048), t !== null && ne(wi), null;
      case 24:
        return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), Bn(Qt), Vt(e), null;
      case 25:
        return null;
      case 30:
        return e.flags |= 33554432, Vt(e), null;
    }
    throw Error(r(156, e.tag));
  }
  function lT(t, e) {
    switch (sr(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return Bn(Qt), ta(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return yu(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (Ne(e), e.alternate === null)
            throw Error(r(340));
          Ri();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (Ne(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(r(340));
          Ri();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return Ar(e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, t = e.memoizedState, t !== null && (t.rendering = null, t.tail = null), e.flags |= 4, e) : null;
      case 4:
        return ta(), null;
      case 10:
        return Bn(e.type), null;
      case 22:
      case 23:
        return Ne(e), br(), t !== null && ne(wi), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return Bn(Qt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function my(t, e) {
    switch (sr(e), e.tag) {
      case 3:
        Bn(Qt), ta();
        break;
      case 26:
      case 27:
      case 5:
        yu(e);
        break;
      case 4:
        ta();
        break;
      case 31:
        e.memoizedState !== null && Ne(e);
        break;
      case 13:
        Ne(e);
        break;
      case 19:
        Ar(e);
        break;
      case 10:
        Bn(e.type);
        break;
      case 22:
      case 23:
        Ne(e), br(), t !== null && ne(wi);
        break;
      case 24:
        Bn(Qt);
    }
  }
  function _l(t, e) {
    try {
      var n = e.updateQueue, i = n !== null ? n.lastEffect : null;
      if (i !== null) {
        var u = i.next;
        n = u;
        do {
          if ((n.tag & t) === t) {
            i = void 0;
            var s = n.create, f = n.inst;
            i = s(), f.destroy = i;
          }
          n = n.next;
        } while (n !== u);
      }
    } catch (y) {
      xt(e, e.return, y);
    }
  }
  function si(t, e, n) {
    try {
      var i = e.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next;
        i = s;
        do {
          if ((i.tag & t) === t) {
            var f = i.inst, y = f.destroy;
            if (y !== void 0) {
              f.destroy = void 0, u = e;
              var T = n, x = y;
              try {
                x();
              } catch (z) {
                xt(
                  u,
                  T,
                  z
                );
              }
            }
          }
          i = i.next;
        } while (i !== s);
      }
    } catch (z) {
      xt(e, e.return, z);
    }
  }
  function yy(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        am(e, n);
      } catch (i) {
        xt(t, t.return, i);
      }
    }
  }
  function gy(t, e, n) {
    n.props = Yi(
      t.type,
      t.memoizedProps
    ), n.state = t.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (i) {
      xt(t, e, i);
    }
  }
  function dn(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var i = t.stateNode;
            break;
          case 30:
            var u = t.stateNode, s = _n(t.memoizedProps, u);
            (u.ref === null || u.ref.name !== s) && (u.ref = Ag(s)), i = u.ref;
            break;
          case 7:
            if (t.stateNode === null) {
              var f = new He(t);
              g(
                t.child,
                !1,
                FT,
                f,
                void 0,
                void 0
              ), t.stateNode = f;
            }
            i = t.stateNode;
            break;
          default:
            i = t.stateNode;
        }
        typeof n == "function" ? t.refCleanup = n(i) : n.current = i;
      }
    } catch (y) {
      xt(t, e, y);
    }
  }
  function se(t, e) {
    var n = t.ref, i = t.refCleanup;
    if (n !== null)
      if (typeof i == "function")
        try {
          i();
        } catch (u) {
          xt(t, e, u);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (u) {
          xt(t, e, u);
        }
      else n.current = null;
  }
  function fs(t, e) {
    if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
      for (var n = 0; n < e.length; n++)
        zg(
          t.stateNode,
          e[n]
        );
  }
  function vy(t) {
    for (var e = t.return; e !== null && (tc(e) && zg(t.stateNode, e.stateNode), !$r(e)); )
      e = e.return;
  }
  function Nl(t) {
    for (var e = t.return; e !== null && (tc(e) && kT(t.stateNode, e.stateNode), !$r(e)); )
      e = e.return;
  }
  function $r(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 27;
  }
  function tc(t) {
    return t && t.tag === 7 && t.stateNode !== null;
  }
  function ec(t) {
    var e = t.type, n = t.memoizedProps, i = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && i.focus();
          break t;
        case "img":
          n.src ? i.src = n.src : n.srcSet && (i.srcset = n.srcSet);
      }
    } catch (u) {
      xt(t, t.return, u);
    }
  }
  function nc(t, e, n) {
    try {
      var i = t.stateNode;
      _T(i, t.type, n, e), i[be] = e;
    } catch (u) {
      xt(t, t.return, u);
    }
  }
  function py(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && mi(t.type) || t.tag === 4;
  }
  function ic(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || py(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && mi(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function ac(t, e, n, i) {
    var u = t.tag;
    if (u === 5 || u === 6)
      u = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(u, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(u), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = cn)), fs(t, i), Tt = !0;
    else if (u !== 4 && (u === 27 && (fs(t, i), i = null, mi(t.type) && (n = t.stateNode, e = null)), t = t.child, t !== null))
      for (ac(
        t,
        e,
        n,
        i
      ), t = t.sibling; t !== null; )
        ac(
          t,
          e,
          n,
          i
        ), t = t.sibling;
  }
  function hs(t, e, n, i) {
    var u = t.tag;
    if (u === 5 || u === 6)
      u = t.stateNode, e ? n.insertBefore(u, e) : n.appendChild(u), fs(t, i), Tt = !0;
    else if (u !== 4 && (u === 27 && (fs(t, i), i = null, mi(t.type) && (n = t.stateNode)), t = t.child, t !== null))
      for (hs(
        t,
        e,
        n,
        i
      ), t = t.sibling; t !== null; )
        hs(
          t,
          e,
          n,
          i
        ), t = t.sibling;
  }
  function Sy(t) {
    var e = t.stateNode, n = t.memoizedProps;
    try {
      for (var i = t.type, u = e.attributes; u.length; )
        e.removeAttributeNode(u[0]);
      oe(e, i, n), e[ie] = t, e[be] = n;
    } catch (s) {
      xt(t, t.return, s);
    }
  }
  var ds = !1, Ve = null;
  function Ty(t) {
    (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (ds = !0);
  }
  var mn = null;
  function by() {
    var t = mn;
    return mn = null, t;
  }
  var Ae = 0;
  function Da(t, e, n, i, u) {
    return Ae = 0, Ey(
      t.child,
      e,
      n,
      i,
      u
    );
  }
  function Ey(t, e, n, i, u) {
    for (var s = !1; t !== null; ) {
      if (t.tag === 5) {
        var f = t.stateNode;
        if (i !== null) {
          var y = Gc(f);
          i.push(y), y.view && (s = !0);
        } else
          s || Gc(f).view && (s = !0);
        ds = !0, bg(
          f,
          Ae === 0 ? e : e + "_" + Ae,
          n
        ), Ae++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && u || Ey(
        t.child,
        e,
        n,
        i,
        u
      ) && (s = !0));
      t = t.sibling;
    }
    return s;
  }
  function yn(t, e) {
    for (; t !== null; )
      t.tag === 5 ? Eg(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && e || yn(
        t.child,
        e
      )), t = t.sibling;
  }
  function ms(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if ((t.tag !== 22 || t.memoizedState === null) && (ms(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
          var e = t.memoizedProps;
          if (e.name == null || e.name === "auto")
            throw Error(r(544));
          var n = e.name;
          e = Nn(e.default, e.share), e !== "none" && (Da(
            t,
            n,
            e,
            null,
            !1
          ) || yn(t.child, !1));
        }
        t = t.sibling;
      }
  }
  function lc(t, e) {
    if (t.tag === 30) {
      var n = t.stateNode, i = t.memoizedProps, u = _n(i, n), s = Nn(
        i.default,
        n.paired ? i.share : i.enter
      );
      s !== "none" ? Da(t, u, s, null, !1) ? (ms(t), n.paired || e || Na(t, i.onEnter)) : yn(t.child, !1) : ms(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        lc(t, e), t = t.sibling;
    else ms(t);
  }
  function uc(t) {
    if (Ve !== null && Ve.size !== 0) {
      var e = Ve;
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var n = t.memoizedProps, i = n.name;
              if (i != null && i !== "auto") {
                var u = e.get(i);
                if (u !== void 0) {
                  var s = Nn(
                    n.default,
                    n.share
                  );
                  if (s !== "none" && (Da(
                    t,
                    i,
                    s,
                    null,
                    !1
                  ) ? (s = t.stateNode, u.paired = s, s.paired = u, Na(t, n.onShare)) : yn(t.child, !1)), e.delete(i), e.size === 0) break;
                }
              }
            }
            uc(t);
          }
          t = t.sibling;
        }
    }
  }
  function sc(t) {
    if (t.tag === 30) {
      var e = t.memoizedProps, n = _n(e, t.stateNode), i = Ve !== null ? Ve.get(n) : void 0, u = Nn(
        e.default,
        i !== void 0 ? e.share : e.exit
      );
      u !== "none" && (Da(t, n, u, null, !1) ? i !== void 0 ? (u = t.stateNode, i.paired = u, u.paired = i, Ve.delete(n), Na(t, e.onShare)) : Na(t, e.onExit) : yn(t.child, !1)), Ve !== null && uc(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        sc(t), t = t.sibling;
    else
      Ve !== null && uc(t);
  }
  function Ay(t) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var e = t.memoizedProps, n = _n(e, t.stateNode);
        e = Nn(e.default, e.update), t.flags &= -5, e !== "none" && Da(
          t,
          n,
          e,
          t.memoizedState = [],
          !1
        );
      } else
        (t.subtreeFlags & 33554432) !== 0 && Ay(t);
      t = t.sibling;
    }
  }
  function oc(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if (t.tag !== 22 || t.memoizedState === null) {
          if (t.tag === 30 && (t.flags & 18874368) !== 0) {
            var e = t.stateNode;
            e.paired !== null && (e.paired = null, yn(t.child, !1));
          }
          oc(t);
        }
        t = t.sibling;
      }
  }
  function ys(t) {
    if (t.tag === 30)
      t.stateNode.paired = null, yn(t.child, !1), oc(t);
    else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        ys(t), t = t.sibling;
    else oc(t);
  }
  function Dy(t) {
    for (t = t.child; t !== null; )
      t.tag === 30 ? yn(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && Dy(t), t = t.sibling;
  }
  function rc(t, e, n, i, u, s, f) {
    for (var y = !1; e !== null; ) {
      if (e.tag === 5) {
        var T = e.stateNode;
        if (s !== null && Ae < s.length) {
          var x = s[Ae], z = Gc(T);
          (x.view || z.view) && (y = !0);
          var U;
          if (U = (t.flags & 4) === 0)
            if (z.clip) U = !0;
            else {
              U = x.rect;
              var D = z.rect;
              U = U.y !== D.y || U.x !== D.x || U.height !== D.height || U.width !== D.width;
            }
          U && (t.flags |= 4), z.abs ? z = !x.abs : (x = x.rect, z = z.rect, z = x.height !== z.height || x.width !== z.width), z && (t.flags |= 32);
        } else t.flags |= 32;
        (t.flags & 4) !== 0 && bg(
          T,
          Ae === 0 ? n : n + "_" + Ae,
          u
        ), y && (t.flags & 4) !== 0 || (mn === null && (mn = []), mn.push(
          T,
          Ae === 0 ? i : i + "_" + Ae,
          e.memoizedProps
        )), Ae++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && f ? t.flags |= e.flags & 32 : rc(
        t,
        e.child,
        n,
        i,
        u,
        s,
        f
      ) && (y = !0));
      e = e.sibling;
    }
    return y;
  }
  function My(t, e) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var n = t.memoizedProps, i = t.stateNode, u = _n(n, i), s = Nn(n.default, n.update), f;
        f = t.memoizedState, t.memoizedState = null, i = t;
        var y = t.child;
        Ae = 0, u = rc(
          i,
          y,
          u,
          u,
          s,
          f,
          !1
        ), (t.flags & 4) !== 0 && u && Na(t, n.onUpdate);
      } else
        (t.subtreeFlags & 33554432) !== 0 && My(t);
      t = t.sibling;
    }
  }
  var te = !1, Dt = !1, gn = !1, cc = !1, xy = typeof WeakSet == "function" ? WeakSet : Set, ee = null, vn = !1, Vl = !1, gs = !1, fc = !1;
  function uT(t, e, n) {
    if (t = t.containerInfo, Bc = qa, t = Rd(t), Wo(t)) {
      if ("selectionStart" in t)
        var i = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          i = (i = t.ownerDocument) && i.defaultView || window;
          var u = i.getSelection && i.getSelection();
          if (u && u.rangeCount !== 0) {
            i = u.anchorNode;
            var s = u.anchorOffset, f = u.focusNode;
            u = u.focusOffset;
            try {
              i.nodeType, f.nodeType;
            } catch {
              i = null;
              break t;
            }
            var y = 0, T = -1, x = -1, z = 0, U = 0, D = t, O = null;
            e: for (; ; ) {
              for (var j; D !== i || s !== 0 && D.nodeType !== 3 || (T = y + s), D !== f || u !== 0 && D.nodeType !== 3 || (x = y + u), D.nodeType === 3 && (y += D.nodeValue.length), (j = D.firstChild) !== null; )
                O = D, D = j;
              for (; ; ) {
                if (D === t) break e;
                if (O === i && ++z === s && (T = y), O === f && ++U === u && (x = y), (j = D.nextSibling) !== null) break;
                D = O, O = D.parentNode;
              }
              D = j;
            }
            i = T === -1 || x === -1 ? null : { start: T, end: x };
          } else i = null;
        }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (Hc = { focusedElem: t, selectionRange: i }, qa = !1, n = (n & 335544064) === n, ee = e, e = n ? 9270 : 1024; ee !== null; ) {
      if (t = ee, n && (i = t.deletions, i !== null))
        for (s = 0; s < i.length; s++)
          n && sc(i[s]);
      if (t.alternate === null && (t.flags & 2) !== 0)
        n && Ty(t), vs(n);
      else {
        if (t.tag === 22) {
          if (i = t.alternate, t.memoizedState !== null) {
            i !== null && i.memoizedState === null && n && sc(i), vs(n);
            continue;
          } else if (i !== null && i.memoizedState !== null) {
            n && Ty(t), vs(n);
            continue;
          }
        }
        i = t.child, (t.subtreeFlags & e) !== 0 && i !== null ? (i.return = t, ee = i) : (n && Ay(t), vs(n));
      }
    }
    Ve = null;
  }
  function vs(t) {
    for (; ee !== null; ) {
      var e = ee, n = t, i = e.alternate, u = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((u & 1024) !== 0 && i !== null) {
            n = void 0, u = i.memoizedProps, i = i.memoizedState;
            var s = e.stateNode;
            try {
              var f = Yi(
                e.type,
                u
              );
              n = s.getSnapshotBeforeUpdate(
                f,
                i
              ), s.__reactInternalSnapshotBeforeUpdate = n;
            } catch (y) {
              xt(e, e.return, y);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (i = e.stateNode.containerInfo, n = i.nodeType, n === 9)
              Qc(i);
            else if (n === 1)
              switch (i.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Qc(i);
                  break;
                default:
                  i.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          n && i !== null && (n = _n(
            i.memoizedProps,
            i.stateNode
          ), u = e.memoizedProps, u = Nn(u.default, u.update), u !== "none" && Da(
            i,
            n,
            u,
            i.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((u & 1024) !== 0) throw Error(r(163));
      }
      if (i = e.sibling, i !== null) {
        i.return = e.return, ee = i;
        break;
      }
      ee = e.return;
    }
  }
  function Cy(t, e, n) {
    var i = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        pn(t, n), i & 4 && _l(5, n);
        break;
      case 1:
        if (pn(t, n), i & 4)
          if (t = n.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (f) {
              xt(n, n.return, f);
            }
          else {
            var u = Yi(
              n.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                u,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              xt(
                n,
                n.return,
                f
              );
            }
          }
        i & 64 && yy(n), i & 512 && dn(n, n.return);
        break;
      case 3:
        if (pn(t, n), i & 64 && (t = n.updateQueue, t !== null)) {
          if (e = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            am(t, e);
          } catch (f) {
            xt(n, n.return, f);
          }
        }
        break;
      case 27:
        e === null && i & 4 && Sy(n);
      case 26:
      case 5:
        pn(t, n), e === null && i & 4 && ec(n), i & 512 && dn(n, n.return);
        break;
      case 12:
        pn(t, n);
        break;
      case 31:
        pn(t, n), i & 4 && _y(t, n);
        break;
      case 13:
        pn(t, n), i & 4 && Ny(t, n), i & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = pT.bind(
          null,
          n
        ), $T(t, n))));
        break;
      case 22:
        if (i = n.memoizedState !== null || te, !i) {
          var s = e !== null && e.memoizedState !== null || Dt;
          e = te, u = Dt, te = i, (Dt = s) && !u ? (i = 2, (n.subtreeFlags & 8772) !== 0 && (i |= 1), tn(
            t,
            n,
            i
          )) : pn(t, n), te = e, Dt = u;
        }
        break;
      case 30:
        pn(t, n), i & 512 && dn(n, n.return);
        break;
      case 7:
        i & 512 && dn(n, n.return);
      default:
        pn(t, n);
    }
  }
  function hc(t, e) {
    for (t = t.child; t !== null; )
      Oy(t, e), t = t.sibling;
  }
  function Oy(t, e) {
    switch (t.tag) {
      case 5:
      case 26:
        try {
          var n = t.stateNode;
          if (e) {
            var i = n.style;
            typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
          } else {
            var u = t.stateNode, s = t.memoizedProps.style, f = s != null && s.hasOwnProperty("display") ? s.display : null;
            u.style.display = f == null || typeof f == "boolean" ? "" : ("" + f).trim();
          }
        } catch (T) {
          xt(t, t.return, T);
        }
        dc(t, e);
        break;
      case 6:
        try {
          t.stateNode.nodeValue = e ? "" : t.memoizedProps, Tt = !0;
        } catch (T) {
          xt(t, t.return, T);
        }
        break;
      case 18:
        try {
          var y = t.stateNode;
          e ? Tg(y, !0) : Tg(t.stateNode, !1);
        } catch (T) {
          xt(t, t.return, T);
        }
        break;
      case 22:
      case 23:
        t.memoizedState === null && hc(t, e);
        break;
      default:
        hc(t, e);
    }
  }
  function dc(t, e) {
    if (t.subtreeFlags & 67108864)
      for (t = t.child; t !== null; ) {
        t: {
          var n = t, i = e;
          switch (n.tag) {
            case 4:
              Oy(n, i);
              break t;
            case 22:
              n.memoizedState === null && dc(n, i);
              break t;
            default:
              dc(n, i);
          }
        }
        t = t.sibling;
      }
  }
  function zy(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, zy(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Eu(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Bt = null, De = !1;
  function Ie(t, e, n) {
    for (n = n.child; n !== null; )
      Ry(t, e, n), n = n.sibling;
  }
  function Ry(t, e, n) {
    if (Oe && typeof Oe.onCommitFiberUnmount == "function")
      try {
        Oe.onCommitFiberUnmount(nl, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Dt || se(n, e), Ie(
          t,
          e,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Dt && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Dt || se(n, e), Nl(n);
        var i = Bt, u = De;
        mi(n.type) && (Bt = n.stateNode, De = !1), Ie(
          t,
          e,
          n
        ), Ug(
          n.stateNode,
          n.type,
          n.memoizedProps
        ), Bt = i, De = u;
        break;
      case 5:
        Dt || se(n, e), Nl(n);
      case 6:
        if (n.tag === 6 && Nl(n), i = Bt, u = De, Bt = null, Ie(
          t,
          e,
          n
        ), Bt = i, De = u, Bt !== null)
          if (De)
            try {
              (Bt.nodeType === 9 ? Bt.body : Bt.nodeName === "HTML" ? Bt.ownerDocument.body : Bt).removeChild(n.stateNode), Tt = !0;
            } catch (s) {
              xt(
                n,
                e,
                s
              );
            }
          else
            try {
              Bt.removeChild(n.stateNode), Tt = !0;
            } catch (s) {
              xt(
                n,
                e,
                s
              );
            }
        break;
      case 18:
        Bt !== null && (De ? (t = Bt, Sg(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          n.stateNode
        ), Xa(t)) : Sg(Bt, n.stateNode));
        break;
      case 4:
        i = Bt, u = De, Bt = n.stateNode.containerInfo, De = !0, Ie(
          t,
          e,
          n
        ), Bt = i, De = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        si(2, n, e), Dt || si(4, n, e), Ie(
          t,
          e,
          n
        );
        break;
      case 1:
        Dt || (se(n, e), i = n.stateNode, typeof i.componentWillUnmount == "function" && gy(
          n,
          e,
          i
        )), Ie(
          t,
          e,
          n
        );
        break;
      case 21:
        Ie(
          t,
          e,
          n
        );
        break;
      case 22:
        Dt = (i = Dt) || n.memoizedState !== null, Ie(
          t,
          e,
          n
        ), Dt = i;
        break;
      case 30:
        se(n, e), Ie(
          t,
          e,
          n
        );
        break;
      case 7:
        Dt || se(n, e), Ie(
          t,
          e,
          n
        );
        break;
      default:
        Ie(
          t,
          e,
          n
        );
    }
  }
  function _y(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        Xa(t);
      } catch (n) {
        xt(e, e.return, n);
      }
    }
  }
  function Ny(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        Xa(t);
      } catch (n) {
        xt(e, e.return, n);
      }
  }
  function sT(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new xy()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new xy()), e;
      default:
        throw Error(r(435, t.tag));
    }
  }
  function ps(t, e) {
    var n = sT(t);
    e.forEach(function(i) {
      if (!n.has(i)) {
        n.add(i);
        var u = ST.bind(null, t, i);
        i.then(u, u);
      }
    });
  }
  function ge(t, e, n) {
    var i = e.deletions;
    if (i !== null)
      for (var u = 0; u < i.length; u++) {
        var s = i[u], f = t, y = e, T = y;
        t: for (; T !== null; ) {
          switch (T.tag) {
            case 27:
              if (mi(T.type)) {
                Bt = T.stateNode, De = !1;
                break t;
              }
              break;
            case 5:
              Bt = T.stateNode, De = !1;
              break t;
            case 3:
            case 4:
              Bt = T.stateNode.containerInfo, De = !0;
              break t;
          }
          T = T.return;
        }
        if (Bt === null) throw Error(r(160));
        Ry(f, y, s), Bt = null, De = !1, f = s.alternate, f !== null && (f.return = null), s.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        Vy(e, t, n), e = e.sibling;
  }
  var $e = null;
  function Vy(t, e, n) {
    var i = t.alternate, u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (u & 4 && (i = t.updateQueue, i = i !== null ? i.events : null, i !== null))
          for (var s = 0; s < i.length; s++) {
            var f = i[s];
            f.ref.impl = f.nextImpl;
          }
        ge(e, t, n), ve(t), u & 4 && (si(3, t, t.return), _l(3, t), si(5, t, t.return));
        break;
      case 1:
        ge(e, t, n), ve(t), u & 512 && (Dt || i === null || se(i, i.return)), u & 64 && te && (t = t.updateQueue, t !== null && (e = t.callbacks, e !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? e : n.concat(e))));
        break;
      case 26:
        if (s = $e, ge(e, t, n), ve(t), u & 512 && (Dt || i === null || se(i, i.return)), u & 4)
          if (u = i !== null ? i.memoizedState : null, n = t.memoizedState, i === null)
            if (n === null)
              if (t.stateNode === null)
                if (te)
                  t.stateNode = gg(
                    t.type,
                    t.memoizedProps,
                    e.containerInfo,
                    t
                  );
                else {
                  t: {
                    e = t.type, n = t.memoizedProps, u = s.ownerDocument || s;
                    e: switch (e) {
                      case "title":
                        i = u.getElementsByTagName("title")[0], (!i || i[ll] || i[ie] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = u.createElement(e), u.head.insertBefore(
                          i,
                          u.querySelector("head > title")
                        )), oe(i, e, n), i[ie] = t, It(i), e = i;
                        break t;
                      case "link":
                        if (s = Yg(
                          "link",
                          "href",
                          u
                        ).get(e + (n.href || ""))) {
                          for (f = 0; f < s.length; f++)
                            if (i = s[f], i.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && i.getAttribute("rel") === (n.rel == null ? null : n.rel) && i.getAttribute("title") === (n.title == null ? null : n.title) && i.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                              s.splice(f, 1);
                              break e;
                            }
                        }
                        i = u.createElement(e), oe(i, e, n), u.head.appendChild(i);
                        break;
                      case "meta":
                        if (s = Yg(
                          "meta",
                          "content",
                          u
                        ).get(e + (n.content || ""))) {
                          for (f = 0; f < s.length; f++)
                            if (i = s[f], i.getAttribute("content") === (n.content == null ? null : "" + n.content) && i.getAttribute("name") === (n.name == null ? null : n.name) && i.getAttribute("property") === (n.property == null ? null : n.property) && i.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && i.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                              s.splice(f, 1);
                              break e;
                            }
                        }
                        i = u.createElement(e), oe(i, e, n), u.head.appendChild(i);
                        break;
                      default:
                        throw Error(r(468, e));
                    }
                    i[ie] = t, It(i), e = i;
                  }
                  t.stateNode = e;
                }
              else
                te || Wc(s, t.type, t.stateNode);
            else
              t.stateNode = jg(
                s,
                n,
                t.memoizedProps
              );
          else
            u !== n ? (u === null ? (e = i.stateNode, e === null || Dt || e.parentNode.removeChild(e)) : u.count--, n === null ? te || Wc(s, t.type, t.stateNode) : jg(s, n, t.memoizedProps)) : n === null && t.stateNode !== null && nc(
              t,
              t.memoizedProps,
              i.memoizedProps
            );
        break;
      case 27:
        ge(e, t, n), ve(t), u & 512 && (Dt || i === null || se(i, i.return)), i !== null && u & 4 && nc(
          t,
          t.memoizedProps,
          i.memoizedProps
        );
        break;
      case 5:
        if (s = gn, gn = !1, ge(e, t, n), gn = s, ve(t), u & 512 && (Dt || i === null || se(i, i.return)), t.flags & 32) {
          e = t.stateNode;
          try {
            ua(e, ""), Tt = !0;
          } catch (z) {
            xt(t, t.return, z);
          }
        }
        u & 4 && t.stateNode != null && (e = t.memoizedProps, nc(
          t,
          e,
          i !== null ? i.memoizedProps : e
        )), u & 1024 && (cc = !0);
        break;
      case 6:
        if (ge(e, t, n), ve(t), u & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          e = t.memoizedProps, n = t.stateNode;
          try {
            n.nodeValue = e, Tt = !0;
          } catch (z) {
            xt(t, t.return, z);
          }
        }
        break;
      case 3:
        if (Tt = !1, Vs = null, s = $e, $e = ql(e.containerInfo), ge(e, t, n), $e = s, ve(t), u & 4 && i !== null && i.memoizedState.isDehydrated)
          try {
            Xa(e.containerInfo);
          } catch (z) {
            xt(t, t.return, z);
          }
        cc && (cc = !1, Uy(t)), Tt = !1;
        break;
      case 4:
        u = gn, gn = te, i = td(), s = $e, $e = ql(
          t.stateNode.containerInfo
        ), ge(e, t, n), ve(t), $e = s, Tt && Vl && (gs = !0), Tt = i, gn = u;
        break;
      case 12:
        ge(e, t, n), ve(t);
        break;
      case 31:
        ge(e, t, n), ve(t), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ps(t, e)));
        break;
      case 13:
        ge(e, t, n), ve(t), t.child.flags & 8192 && t.memoizedState !== null != (i !== null && i.memoizedState !== null) && (bs = Ce()), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ps(t, e)));
        break;
      case 22:
        s = t.memoizedState !== null, f = i !== null && i.memoizedState !== null;
        var y = te, T = Dt, x = gn;
        te = y || s, gn = x || s, Dt = T || f, ge(e, t, n), Dt = T, gn = x, te = y, ve(t), u & 8192 && (e = t.stateNode, e._visibility = s ? e._visibility & -2 : e._visibility | 1, !s || i === null || f || te || Dt || (e = f || Dt, n = te, i = Dt, te = s || te, Dt = e, oi(t, 2), te = n, Dt = i), !s && gn || hc(t, s)), u & 4 && (e = t.updateQueue, e !== null && (n = e.retryQueue, n !== null && (e.retryQueue = null, ps(t, n))));
        break;
      case 19:
        ge(e, t, n), ve(t), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ps(t, e)));
        break;
      case 30:
        u & 512 && (Dt || i === null || se(i, i.return)), u = td(), s = Vl, f = (n & 335544064) === n, y = t.memoizedProps, Vl = f && Nn(
          y.default,
          y.update
        ) !== "none", ge(e, t, n), ve(t), f && i !== null && Tt && (t.flags |= 4), Vl = s, Tt = u;
        break;
      case 21:
        break;
      case 7:
        u & 512 && (Dt || i === null || se(i, i.return)), i && i.stateNode !== null && (i.stateNode._fragmentFiber = t);
      default:
        ge(e, t, n), ve(t);
    }
  }
  function ve(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, i = t.return; i !== null; ) {
          if (py(i)) {
            n = i;
            break;
          }
          i = i.return;
        }
        i = null;
        for (var u = t.return; u !== null; ) {
          if (tc(u)) {
            var s = u.stateNode;
            i === null ? i = [s] : i.push(s);
          }
          if ($r(u)) break;
          u = u.return;
        }
        var f = i;
        if (n == null) throw Error(r(160));
        switch (n.tag) {
          case 27:
            var y = n.stateNode, T = ic(t);
            hs(
              t,
              T,
              y,
              f
            );
            break;
          case 5:
            var x = n.stateNode;
            n.flags & 32 && (ua(x, ""), n.flags &= -33);
            var z = ic(t);
            hs(
              t,
              z,
              x,
              f
            );
            break;
          case 3:
          case 4:
            var U = n.stateNode.containerInfo, D = ic(t);
            ac(
              t,
              D,
              U,
              f
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (O) {
        xt(t, t.return, O);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Uy(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Uy(e), e.tag === 5 && e.flags & 1024 && (e = e.stateNode, qa = !0, e.reset(), qa = !1), t = t.sibling;
      }
  }
  function Ma(t, e) {
    if (e.subtreeFlags & 9270)
      for (e = e.child; e !== null; )
        wy(e, t), e = e.sibling;
    else My(e);
  }
  function wy(t, e) {
    var n = t.alternate;
    if (n === null) lc(t, !1);
    else
      switch (t.tag) {
        case 3:
          if (fc = vn = !1, by(), Ma(e, t), !vn && !gs) {
            if (t = mn, t !== null)
              for (var i = 0; i < t.length; i += 3) {
                n = t[i];
                var u = t[i + 1];
                Eg(n, t[i + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + u + ")"
                  }
                );
              }
            t = e.containerInfo, t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "" && (t.style.viewTransitionName = "none", t.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), t.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), fc = !0;
          }
          mn = null;
          break;
        case 5:
          Ma(e, t);
          break;
        case 4:
          i = vn, vn = !1, Ma(e, t), vn && (gs = !0), vn = i;
          break;
        case 22:
          t.memoizedState === null && (n.memoizedState !== null ? lc(t, !1) : Ma(e, t));
          break;
        case 30:
          i = vn, u = by(), vn = !1, Ma(e, t), vn && (t.flags |= 4);
          var s = t.memoizedProps, f = t.stateNode;
          e = _n(s, f), f = _n(n.memoizedProps, f);
          var y = Nn(s.default, s.update);
          y === "none" ? e = !1 : (s = n.memoizedState, n.memoizedState = null, n = t.child, Ae = 0, e = rc(
            t,
            n,
            e,
            f,
            y,
            s,
            !0
          ), Ae !== (s === null ? 0 : s.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && e ? (Na(
            t,
            t.memoizedProps.onUpdate
          ), mn = u) : u !== null && (u.push.apply(u, mn), mn = u), vn = (t.flags & 32) !== 0 ? !0 : i;
          break;
        default:
          Ma(e, t);
      }
  }
  function pn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        Cy(t, e.alternate, e), e = e.sibling;
  }
  function oi(t, e) {
    for (t = t.child; t !== null; ) {
      var n = t, i = e;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          si(4, n, n.return), oi(
            n,
            i
          );
          break;
        case 1:
          se(n, n.return);
          var u = n.stateNode;
          typeof u.componentWillUnmount == "function" && gy(
            n,
            n.return,
            u
          ), oi(
            n,
            i
          );
          break;
        case 27:
          (i & 2) !== 0 && Ug(
            n.stateNode,
            n.type,
            n.memoizedProps
          );
        case 5:
          se(n, n.return), n.tag !== 5 && n.tag !== 27 || Nl(n), oi(
            n,
            i
          );
          break;
        case 6:
          Nl(n);
          break;
        case 26:
          se(n, n.return), u = n.stateNode, n.memoizedState !== null || u === null || Dt || u.parentNode.removeChild(u), oi(
            n,
            i
          );
          break;
        case 22:
          n.memoizedState === null && oi(
            n,
            i
          );
          break;
        case 30:
          se(n, n.return), oi(
            n,
            i
          );
          break;
        case 7:
          se(n, n.return);
        default:
          oi(
            n,
            i
          );
      }
      t = t.sibling;
    }
  }
  function tn(t, e, n) {
    for (n = (e.subtreeFlags & 8772) !== 0 ? n : n & -2, e = e.child; e !== null; ) {
      var i = e.alternate, u = t, s = e, f = s.flags, y = (n & 1) !== 0;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          tn(
            u,
            s,
            n
          ), _l(4, s);
          break;
        case 1:
          if (tn(
            u,
            s,
            n
          ), i = s, u = i.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (z) {
              xt(i, i.return, z);
            }
          if (i = s, u = i.updateQueue, u !== null) {
            var T = i.stateNode;
            try {
              var x = u.shared.hiddenCallbacks;
              if (x !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < x.length; u++)
                  im(x[u], T);
            } catch (z) {
              xt(i, i.return, z);
            }
          }
          y && f & 64 && yy(s), dn(s, s.return);
          break;
        case 27:
          (n & 2) !== 0 && Sy(s);
        case 5:
          s.tag !== 5 && s.tag !== 27 || vy(s), tn(
            u,
            s,
            n
          ), y && i === null && f & 4 && ec(s), dn(s, s.return);
          break;
        case 6:
          vy(s);
          break;
        case 26:
          T = s.stateNode, s.memoizedState !== null || T === null || te || Wc(
            ql(T.ownerDocument),
            s.type,
            T
          ), tn(
            u,
            s,
            n
          ), y && i === null && f & 4 && ec(s), dn(s, s.return);
          break;
        case 12:
          tn(
            u,
            s,
            n
          );
          break;
        case 31:
          tn(
            u,
            s,
            n
          ), y && f & 4 && _y(u, s);
          break;
        case 13:
          tn(
            u,
            s,
            n
          ), y && f & 4 && Ny(u, s);
          break;
        case 22:
          s.memoizedState === null && tn(
            u,
            s,
            n
          ), dn(s, s.return);
          break;
        case 30:
          tn(
            u,
            s,
            n
          ), dn(s, s.return);
          break;
        case 7:
          dn(s, s.return);
        default:
          tn(
            u,
            s,
            n
          );
      }
      e = e.sibling;
    }
  }
  function mc(t, e) {
    var n = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && pl(n));
  }
  function yc(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && pl(t));
  }
  function Ke(t, e, n, i) {
    var u = (n & 335544064) === n;
    if (e.subtreeFlags & (u ? 10262 : 10256))
      for (e = e.child; e !== null; )
        By(
          t,
          e,
          n,
          i
        ), e = e.sibling;
    else u && Dy(e);
  }
  function By(t, e, n, i) {
    var u = (n & 335544064) === n;
    u && e.alternate === null && e.return !== null && e.return.alternate !== null && ys(e);
    var s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Ke(
          t,
          e,
          n,
          i
        ), s & 2048 && _l(9, e);
        break;
      case 1:
        Ke(
          t,
          e,
          n,
          i
        );
        break;
      case 3:
        Ke(
          t,
          e,
          n,
          i
        ), u && fc && (t = t.containerInfo, t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""), t = t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "none" && (t.style.viewTransitionName = "")), s & 2048 && (s = null, e.alternate !== null && (s = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== s && (e.refCount++, s != null && pl(s)));
        break;
      case 12:
        if (s & 2048) {
          Ke(
            t,
            e,
            n,
            i
          ), s = e.stateNode;
          try {
            var f = e.memoizedProps, y = f.id, T = f.onPostCommit;
            typeof T == "function" && T(
              y,
              e.alternate === null ? "mount" : "update",
              s.passiveEffectDuration,
              -0
            );
          } catch (x) {
            xt(e, e.return, x);
          }
        } else
          Ke(
            t,
            e,
            n,
            i
          );
        break;
      case 31:
        Ke(
          t,
          e,
          n,
          i
        );
        break;
      case 13:
        Ke(
          t,
          e,
          n,
          i
        );
        break;
      case 23:
        break;
      case 22:
        f = e.stateNode, y = e.alternate, e.memoizedState !== null ? (u && y !== null && y.memoizedState === null && ys(y), f._visibility & 2 ? Ke(
          t,
          e,
          n,
          i
        ) : Ul(
          t,
          e
        )) : (u && y !== null && y.memoizedState !== null && ys(e), f._visibility & 2 ? Ke(
          t,
          e,
          n,
          i
        ) : (f._visibility |= 2, xa(
          t,
          e,
          n,
          i,
          (e.subtreeFlags & 10256) !== 0 || !1
        ))), s & 2048 && mc(y, e);
        break;
      case 24:
        Ke(
          t,
          e,
          n,
          i
        ), s & 2048 && yc(e.alternate, e);
        break;
      case 30:
        u && (s = e.alternate, s !== null && (yn(s.child, !0), yn(e.child, !0))), Ke(
          t,
          e,
          n,
          i
        );
        break;
      default:
        Ke(
          t,
          e,
          n,
          i
        );
    }
  }
  function xa(t, e, n, i, u) {
    for (u = u && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var s = t, f = e, y = n, T = i, x = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          xa(
            s,
            f,
            y,
            T,
            u
          ), _l(8, f);
          break;
        case 23:
          break;
        case 22:
          var z = f.stateNode;
          f.memoizedState !== null ? z._visibility & 2 ? xa(
            s,
            f,
            y,
            T,
            u
          ) : Ul(
            s,
            f
          ) : (z._visibility |= 2, xa(
            s,
            f,
            y,
            T,
            u
          )), u && x & 2048 && mc(
            f.alternate,
            f
          );
          break;
        case 24:
          xa(
            s,
            f,
            y,
            T,
            u
          ), u && x & 2048 && yc(f.alternate, f);
          break;
        default:
          xa(
            s,
            f,
            y,
            T,
            u
          );
      }
      e = e.sibling;
    }
  }
  function Ul(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t, i = e, u = i.flags;
        switch (i.tag) {
          case 22:
            Ul(n, i), u & 2048 && mc(
              i.alternate,
              i
            );
            break;
          case 24:
            Ul(n, i), u & 2048 && yc(i.alternate, i);
            break;
          default:
            Ul(n, i);
        }
        e = e.sibling;
      }
  }
  var Gi = 8192;
  function qi(t, e, n) {
    if (t.subtreeFlags & Gi)
      for (t = t.child; t !== null; )
        Hy(
          t,
          e,
          n
        ), t = t.sibling;
  }
  function Hy(t, e, n) {
    switch (t.tag) {
      case 26:
        qi(
          t,
          e,
          n
        ), t.flags & Gi && (t.memoizedState !== null ? db(
          n,
          $e,
          t.memoizedState,
          t.memoizedProps
        ) : (t = t.stateNode, (e & 335544128) === e && Qg(n, t)));
        break;
      case 5:
        qi(
          t,
          e,
          n
        ), t.flags & Gi && (t = t.stateNode, (e & 335544128) === e && Qg(n, t));
        break;
      case 3:
      case 4:
        var i = $e;
        $e = ql(t.stateNode.containerInfo), qi(
          t,
          e,
          n
        ), $e = i;
        break;
      case 22:
        t.memoizedState === null && (i = t.alternate, i !== null && i.memoizedState !== null ? (i = Gi, Gi = 16777216, qi(
          t,
          e,
          n
        ), Gi = i) : qi(
          t,
          e,
          n
        ));
        break;
      case 30:
        if ((t.flags & Gi) !== 0 && (i = t.memoizedProps.name, i != null && i !== "auto")) {
          var u = t.stateNode;
          u.paired = null, Ve === null && (Ve = /* @__PURE__ */ new Map()), Ve.set(i, u);
        }
        qi(
          t,
          e,
          n
        );
        break;
      default:
        qi(
          t,
          e,
          n
        );
    }
  }
  function Ly(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function wl(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          ee = i, Yy(
            i,
            t
          );
        }
      Ly(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        jy(t), t = t.sibling;
  }
  function jy(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        wl(t), t.flags & 2048 && si(9, t, t.return);
        break;
      case 3:
        wl(t);
        break;
      case 12:
        wl(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, Ss(t)) : wl(t);
        break;
      default:
        wl(t);
    }
  }
  function Ss(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          ee = i, Yy(
            i,
            t
          );
        }
      Ly(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          si(8, e, e.return), Ss(e);
          break;
        case 22:
          n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, Ss(e));
          break;
        default:
          Ss(e);
      }
      t = t.sibling;
    }
  }
  function Yy(t, e) {
    for (; ee !== null; ) {
      var n = ee;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          si(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var i = n.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          pl(n.memoizedState.cache);
      }
      if (i = n.child, i !== null) i.return = n, ee = i;
      else
        t: for (n = t; ee !== null; ) {
          i = ee;
          var u = i.sibling, s = i.return;
          if (zy(i), i === n) {
            ee = null;
            break t;
          }
          if (u !== null) {
            u.return = s, ee = u;
            break t;
          }
          ee = s;
        }
    }
  }
  var oT = {
    getCacheForType: function(t) {
      var e = ae(Qt), n = e.data.get(t);
      return n === void 0 && (n = t(), e.data.set(t, n)), n;
    },
    cacheSignal: function() {
      return ae(Qt).controller.signal;
    }
  }, rT = typeof WeakMap == "function" ? WeakMap : Map, At = 0, Rt = null, ct = null, ht = 0, Mt = 0, Ue = null, ri = !1, Ca = !1, gc = !1, Gn = 0, qt = 0, ci = 0, Xi = 0, Ts = 0, we = 0, Oa = 0, Bl = null, Me = null, vc = !1, bs = 0, Gy = 0, Es = 1 / 0, As = null, fi = null, jt = 0, en = null, Qi = null, Sn = 0, pc = 0, Sc = null, qy = null, za = null, Ra = null, _a = null, Hl = 0, Ds = null;
  function Be() {
    return (At & 2) !== 0 && ht !== 0 ? ht & -ht : F.T !== null ? zc() : Zh();
  }
  function Xy() {
    if (we === 0)
      if ((ht & 536870912) === 0 || st) {
        var t = pu;
        pu <<= 1, (pu & 3932160) === 0 && (pu = 262144), we = t;
      } else we = 536870912;
    return t = le.current, t !== null && (t.flags |= 32), we;
  }
  function Na(t, e) {
    if (e != null) {
      var n = t.stateNode, i = n.ref;
      i === null && (i = n.ref = Ag(
        _n(t.memoizedProps, n)
      )), Ra === null && (Ra = []), Ra.push(e.bind(null, i));
    }
  }
  function xe(t, e, n) {
    (t === Rt && (Mt === 2 || Mt === 9) || t.cancelPendingCommit !== null) && (Va(t, 0), hi(
      t,
      ht,
      we,
      !1
    )), al(t, n), ((At & 2) === 0 || t !== Rt) && (t === Rt && ((At & 2) === 0 && (Xi |= n), qt === 4 && hi(
      t,
      ht,
      we,
      !1
    )), Tn(t));
  }
  function Qy(t, e, n) {
    if ((At & 6) !== 0) throw Error(r(327));
    var i = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || il(t, e), u = i ? hT(t, e) : bc(t, e, !0), s = i;
    do {
      if (u === 0) {
        Ca && !i && hi(t, e, 0, !1);
        break;
      } else {
        if (n = t.current.alternate, s && !cT(n)) {
          u = bc(t, e, !1), s = !1;
          continue;
        }
        if (u === 2) {
          if (s = e, t.errorRecoveryDisabledLanes & s)
            var f = 0;
          else
            f = t.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            e = f;
            t: {
              var y = t;
              u = Bl;
              var T = y.current.memoizedState.isDehydrated;
              if (T && (Va(y, f).flags |= 256), f = bc(
                y,
                f,
                !1
              ), f !== 2 && f !== 6) {
                if (gc && !T) {
                  y.errorRecoveryDisabledLanes |= s, Xi |= s, u = 4;
                  break t;
                }
                s = Me, Me = u, s !== null && (Me === null ? Me = s : Me.push.apply(
                  Me,
                  s
                ));
              }
              u = f;
            }
            if (s = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          Va(t, 0), hi(t, e, 0, !0);
          break;
        }
        t: {
          switch (i = t, s = u, s) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((e & 4194048) !== e && (e & 62914560) !== e)
                break;
            case 6:
              hi(
                i,
                e,
                we,
                !ri
              );
              break t;
            case 2:
              Me = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((e & 62914560) === e && (u = bs + 300 - Ce(), 10 < u)) {
            if (hi(
              i,
              e,
              we,
              !ri
            ), Tu(i, 0, !0) !== 0) break t;
            Sn = e, i.timeoutHandle = Yc(
              Zy.bind(
                null,
                i,
                n,
                Me,
                As,
                vc,
                e,
                we,
                Xi,
                Oa,
                ri,
                s,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break t;
          }
          Zy(
            i,
            n,
            Me,
            As,
            vc,
            e,
            we,
            Xi,
            Oa,
            ri,
            s,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Tn(t);
  }
  function Zy(t, e, n, i, u, s, f, y, T, x, z, U, D, O) {
    t.timeoutHandle = -1;
    var j = e.subtreeFlags, J = (s & 335544064) === s;
    if (U = null, (J || j & 8192 || (j & 16785408) === 16785408) && (U = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: cn
    }, Ve = null, Hy(
      e,
      s,
      U
    ), J && (j = U, J = t.containerInfo, J = (J.nodeType === 9 ? J : J.ownerDocument).__reactViewTransition, J != null && (j.count++, j.waitingForViewTransition = !0, j = Zl.bind(j), J.finished.then(j, j))), j = (s & 62914560) === s ? bs - Ce() : (s & 4194048) === s ? Gy - Ce() : 0, j = mb(
      U,
      j
    ), j !== null)) {
      Sn = s, t.cancelPendingCommit = j(
        $y.bind(
          null,
          t,
          e,
          s,
          n,
          i,
          u,
          f,
          y,
          T,
          x,
          z,
          U,
          null,
          D,
          O
        )
      ), hi(t, s, f, !x);
      return;
    }
    $y(
      t,
      e,
      s,
      n,
      i,
      u,
      f,
      y,
      T,
      x,
      z,
      U
    );
  }
  function cT(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var i = 0; i < n.length; i++) {
          var u = n[i], s = u.getSnapshot;
          u = u.value;
          try {
            if (!_e(s(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = e.child, e.subtreeFlags & 16384 && n !== null)
        n.return = e, e = n;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function hi(t, e, n, i) {
    e = Yh(t, e), e &= ~Ts, e &= ~Xi, t.suspendedLanes |= e, t.pingedLanes &= ~e, i && (t.warmLanes |= e), i = t.expirationTimes;
    for (var u = e; 0 < u; ) {
      var s = 31 - ze(u), f = 1 << s;
      i[s] = -1, u &= ~f;
    }
    n !== 0 && qh(t, n, e);
  }
  function Ms() {
    return (At & 6) === 0 ? (Ll(0), !1) : !0;
  }
  function Tc() {
    if (ct !== null) {
      if (Mt === 0)
        var t = ct.return;
      else
        t = ct, wn = _i = null, Or(t), Sa = null, bl = 0, t = ct;
      for (; t !== null; )
        my(t.alternate, t), t = t.return;
      ct = null;
    }
  }
  function Va(t, e) {
    var n = t.timeoutHandle;
    return n !== -1 && (t.timeoutHandle = -1, UT(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), Sn = 0, Tc(), Rt = t, ct = n = Vn(t.current, null), ht = e, Mt = 0, Ue = null, ri = !1, Ca = il(t, e), gc = !1, Oa = we = Ts = Xi = ci = qt = 0, Me = Bl = null, vc = !1, Gn = Yh(t, e), Vu(), n;
  }
  function Ky(t, e) {
    lt = null, F.H = as, e === pa || e === Qu ? (e = $d(), Mt = 3) : e === yr ? (e = $d(), Mt = 4) : Mt = e === Xr ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Ue = e, ct === null && (qt = 1, ls(
      t,
      qe(e, t.current)
    ));
  }
  function Jy() {
    var t = le.current;
    return t === null ? !0 : (ht & 4194048) === ht ? de === null : (ht & 62914560) === ht || (ht & 536870912) !== 0 ? t === de : !1;
  }
  function Py() {
    var t = F.H;
    return F.H = as, t === null ? as : t;
  }
  function Fy() {
    var t = F.A;
    return F.A = oT, t;
  }
  function xs() {
    qt = 4, ri || (ht & 4194048) !== ht && le.current !== null || (Ca = !0), (ci & 134217727) === 0 && (Xi & 134217727) === 0 || Rt === null || hi(
      Rt,
      ht,
      we,
      !1
    );
  }
  function bc(t, e, n) {
    var i = At;
    At |= 2;
    var u = Py(), s = Fy();
    (Rt !== t || ht !== e) && (As = null, Va(t, e)), e = !1;
    var f = qt;
    t: do
      try {
        if (Mt !== 0 && ct !== null) {
          var y = ct, T = Ue;
          switch (Mt) {
            case 8:
              Tc(), f = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              le.current === null && (e = !0);
              var x = Mt;
              if (Mt = 0, Ue = null, Ua(t, y, T, x), n && Ca) {
                f = 0;
                break t;
              }
              break;
            default:
              x = Mt, Mt = 0, Ue = null, Ua(t, y, T, x);
          }
        }
        fT(), f = qt;
        break;
      } catch (z) {
        Ky(t, z);
      }
    while (!0);
    return e && t.shellSuspendCounter++, wn = _i = null, At = i, F.H = u, F.A = s, ct === null && (Rt = null, ht = 0, Vu()), f;
  }
  function fT() {
    for (; ct !== null; ) ky(ct);
  }
  function hT(t, e) {
    var n = At;
    At |= 2;
    var i = Py(), u = Fy();
    Rt !== t || ht !== e ? (As = null, Es = Ce() + 500, Va(t, e)) : Ca = il(
      t,
      e
    );
    t: do
      try {
        if (Mt !== 0 && ct !== null) {
          e = ct;
          var s = Ue;
          e: switch (Mt) {
            case 1:
              Mt = 0, Ue = null, Ua(t, e, s, 1);
              break;
            case 2:
            case 9:
              if (Wd(s)) {
                Mt = 0, Ue = null, Wy(e);
                break;
              }
              e = function() {
                Mt !== 2 && Mt !== 9 || Rt !== t || (Mt = 7), Tn(t);
              }, s.then(e, e);
              break t;
            case 3:
              Mt = 7;
              break t;
            case 4:
              Mt = 5;
              break t;
            case 7:
              Wd(s) ? (Mt = 0, Ue = null, Wy(e)) : (Mt = 0, Ue = null, Ua(t, e, s, 7));
              break;
            case 5:
              var f = null;
              switch (ct.tag) {
                case 26:
                  f = ct.memoizedState;
                case 5:
                case 27:
                  var y = ct;
                  if (f ? qg(f) : y.stateNode.complete) {
                    Mt = 0, Ue = null;
                    var T = y.sibling;
                    if (T !== null) ct = T;
                    else {
                      var x = y.return;
                      x !== null ? (ct = x, Cs(x)) : ct = null;
                    }
                    break e;
                  }
              }
              Mt = 0, Ue = null, Ua(t, e, s, 5);
              break;
            case 6:
              Mt = 0, Ue = null, Ua(t, e, s, 6);
              break;
            case 8:
              Tc(), qt = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        dT();
        break;
      } catch (z) {
        Ky(t, z);
      }
    while (!0);
    return wn = _i = null, F.H = i, F.A = u, At = n, ct !== null ? 0 : (Rt = null, ht = 0, Vu(), qt);
  }
  function dT() {
    for (; ct !== null && !R1(); )
      ky(ct);
  }
  function ky(t) {
    var e = hy(t.alternate, t, Gn);
    t.memoizedProps = t.pendingProps, e === null ? Cs(t) : ct = e;
  }
  function Wy(t) {
    var e = t, n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = ly(
          n,
          e,
          e.pendingProps,
          e.type,
          void 0,
          ht
        );
        break;
      case 11:
        e = ly(
          n,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          ht
        );
        break;
      case 5:
        Or(e);
        var i = e;
        i === $t && (st ? (ju(i), i.tag === 5 && i.stateNode != null && (Nt = i.stateNode)) : (ju(i), st = !0));
      default:
        my(n, e), e = ct = Yd(e, Gn), e = hy(n, e, Gn);
    }
    t.memoizedProps = t.pendingProps, e === null ? Cs(t) : ct = e;
  }
  function Ua(t, e, n, i) {
    wn = _i = null, Or(e), Sa = null, bl = 0;
    var u = e.return;
    try {
      if (tT(
        t,
        u,
        e,
        n,
        ht
      )) {
        qt = 1, ls(
          t,
          qe(n, t.current)
        ), ct = null;
        return;
      }
    } catch (s) {
      if (u !== null) throw ct = u, s;
      qt = 1, ls(
        t,
        qe(n, t.current)
      ), ct = null;
      return;
    }
    e.flags & 32768 ? (st || i === 1 ? t = !0 : Ca || (ht & 536870912) !== 0 ? t = !1 : (ri = t = !0, (i === 2 || i === 9 || i === 3 || i === 6) && (i = le.current, i !== null && i.tag === 13 && (i.flags |= 16384))), Iy(e, t)) : Cs(e);
  }
  function Cs(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Iy(
          e,
          ri
        );
        return;
      }
      t = e.return;
      var n = aT(
        e.alternate,
        e,
        Gn
      );
      if (n !== null) {
        ct = n;
        return;
      }
      if (e = e.sibling, e !== null) {
        ct = e;
        return;
      }
      ct = e = t;
    } while (e !== null);
    qt === 0 && (qt = 5);
  }
  function Iy(t, e) {
    do {
      var n = lT(t.alternate, t);
      if (n !== null) {
        n.flags &= 32767, ct = n;
        return;
      }
      if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
        ct = t;
        return;
      }
      ct = t = n;
    } while (t !== null);
    qt = 6, ct = null;
  }
  function $y(t, e, n, i, u, s, f, y, T, x, z, U) {
    t.cancelPendingCommit = null;
    do
      Os();
    while (jt !== 0);
    if ((At & 6) !== 0) throw Error(r(327));
    if (e !== null) {
      if (e === t.current) throw Error(r(177));
      t === Rt && (ct = Rt = null, ht = 0), Qi = e, en = t, Sn = n, Sc = u, qy = i, mT(
        t,
        e,
        n,
        f,
        y,
        T,
        U
      );
    }
  }
  function mT(t, e, n, i, u, s, f) {
    var y = e.lanes | e.childLanes;
    if (pc = y, y |= nr, Y1(
      t,
      n,
      y,
      i,
      u,
      s
    ), Ra = null, (n & 335544064) === n ? (_a = qS(t), i = 10262) : (_a = null, i = 10256), (e.subtreeFlags & i) !== 0 || (e.flags & i) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, TT(gu, function() {
      return Mc(), null;
    })) : (t.callbackNode = null, t.callbackPriority = 0), ds = !1, i = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || i) {
      i = F.T, F.T = null, u = nt.p, nt.p = 2, s = At, At |= 4;
      try {
        uT(t, e, n);
      } finally {
        At = s, nt.p = u, F.T = i;
      }
    }
    jt = 1, ds ? za = YT(
      f,
      t.containerInfo,
      _a,
      Ec,
      Ac,
      gT,
      Dc,
      Mc,
      yT
    ) : (Ec(), Ac(), Dc());
  }
  function yT(t) {
    if (jt !== 0) {
      var e = en.onRecoverableError;
      e(t, { componentStack: null });
    }
  }
  function gT() {
    jt === 3 && (jt = 0, wy(Qi, en), jt = 4);
  }
  function Ec() {
    if (jt === 1) {
      jt = 0;
      var t = en, e = Qi, n = Sn, i = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || i) {
        i = F.T, F.T = null;
        var u = nt.p;
        nt.p = 2;
        var s = At;
        At |= 4;
        try {
          Vl = gs = !1, Vy(e, t, n), n = Hc;
          var f = Rd(t.containerInfo), y = n.focusedElem, T = n.selectionRange;
          if (f !== y && y && y.ownerDocument && zd(
            y.ownerDocument.documentElement,
            y
          )) {
            if (T !== null && Wo(y)) {
              var x = T.start, z = T.end;
              if (z === void 0 && (z = x), "selectionStart" in y)
                y.selectionStart = x, y.selectionEnd = Math.min(
                  z,
                  y.value.length
                );
              else {
                var U = y.ownerDocument || document, D = U && U.defaultView || window;
                if (D.getSelection) {
                  var O = D.getSelection(), j = y.textContent.length, J = Math.min(T.start, j), ut = T.end === void 0 ? J : Math.min(T.end, j);
                  !O.extend && J > ut && (f = ut, ut = J, J = f);
                  var M = Od(
                    y,
                    J
                  ), E = Od(
                    y,
                    ut
                  );
                  if (M && E && (O.rangeCount !== 1 || O.anchorNode !== M.node || O.anchorOffset !== M.offset || O.focusNode !== E.node || O.focusOffset !== E.offset)) {
                    var C = U.createRange();
                    C.setStart(M.node, M.offset), O.removeAllRanges(), J > ut ? (O.addRange(C), O.extend(E.node, E.offset)) : (C.setEnd(E.node, E.offset), O.addRange(C));
                  }
                }
              }
            }
            for (U = [], O = y; O = O.parentNode; )
              O.nodeType === 1 && U.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof y.focus == "function" && y.focus(), y = 0; y < U.length; y++) {
              var N = U[y];
              N.element.scrollLeft = N.left, N.element.scrollTop = N.top;
            }
          }
          qa = !!Bc, Hc = Bc = null;
        } finally {
          At = s, nt.p = u, F.T = i;
        }
      }
      t.current = e, jt = 2;
    }
  }
  function Ac() {
    if (jt === 2) {
      jt = 0;
      var t = en, e = Qi, n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        n = F.T, F.T = null;
        var i = nt.p;
        nt.p = 2;
        var u = At;
        At |= 4;
        try {
          Cy(t, e.alternate, e);
        } finally {
          At = u, nt.p = i, F.T = n;
        }
      }
      jt = 3;
    }
  }
  function Dc() {
    if (jt === 4 || jt === 3) {
      jt = 0;
      var t = za;
      za = null, _1();
      var e = en, n = Qi, i = Sn, u = qy, s = (i & 335544064) === i ? 10262 : 10256;
      if ((n.subtreeFlags & s) !== 0 || (n.flags & s) !== 0 ? jt = 5 : (jt = 0, Qi = en = null, tg(e, e.pendingLanes)), s = e.pendingLanes, s === 0 && (fi = null), Vo(i), n = n.stateNode, Oe && typeof Oe.onCommitFiberRoot == "function")
        try {
          Oe.onCommitFiberRoot(
            nl,
            n,
            void 0,
            (n.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        n = F.T, s = nt.p, nt.p = 2, F.T = null;
        try {
          for (var f = e.onRecoverableError, y = 0; y < u.length; y++) {
            var T = u[y];
            f(T.value, {
              componentStack: T.stack
            });
          }
        } finally {
          F.T = n, nt.p = s;
        }
      }
      if (u = Ra, f = _a, _a = null, u !== null && (Ra = null, f === null && (f = []), t !== null))
        for (T = 0; T < u.length; T++)
          n = (0, u[T])(
            f
          ), n !== void 0 && t.finished.finally(n);
      (Sn & 3) !== 0 && Os(), Tn(e), s = e.pendingLanes, (i & 261930) !== 0 && (s & 42) !== 0 ? e === Ds ? Hl++ : (Hl = 0, Ds = e) : (Hl = 0, Ds = null), Ll(0);
    }
  }
  function tg(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, pl(e)));
  }
  function Os() {
    return za !== null && (za.skipTransition(), za = null), Ec(), Ac(), Dc(), Mc();
  }
  function Mc() {
    if (jt !== 5) return !1;
    var t = en, e = pc;
    pc = 0;
    var n = Vo(Sn), i = F.T, u = nt.p;
    try {
      nt.p = 32 > n ? 32 : n, F.T = null, n = Sc, Sc = null;
      var s = en, f = Sn;
      if (jt = 0, Qi = en = null, Sn = 0, (At & 6) !== 0) throw Error(r(331));
      var y = At;
      if (At |= 4, jy(s.current), By(
        s,
        s.current,
        f,
        n
      ), At = y, Ll(0, !1), Oe && typeof Oe.onPostCommitFiberRoot == "function")
        try {
          Oe.onPostCommitFiberRoot(nl, s);
        } catch {
        }
      return !0;
    } finally {
      nt.p = u, F.T = i, tg(t, e);
    }
  }
  function eg(t, e, n) {
    e = qe(n, e), e = qr(t.stateNode, e, 2), t = ii(t, e, 2), t !== null && (al(t, 2), Tn(t));
  }
  function xt(t, e, n) {
    if (t.tag === 3)
      eg(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          eg(
            e,
            t,
            n
          );
          break;
        } else if (e.tag === 1) {
          var i = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (fi === null || !fi.has(i))) {
            t = qe(n, t), n = Wm(2), i = ii(e, n, 2), i !== null && (Im(
              n,
              i,
              e,
              t
            ), al(i, 2), Tn(i));
            break;
          }
        }
        e = e.return;
      }
  }
  function xc(t, e, n) {
    var i = t.pingCache;
    if (i === null) {
      i = t.pingCache = new rT();
      var u = /* @__PURE__ */ new Set();
      i.set(e, u);
    } else
      u = i.get(e), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(e, u));
    u.has(n) || (gc = !0, u.add(n), t = vT.bind(null, t, e, n), e.then(t, t));
  }
  function vT(t, e, n) {
    var i = t.pingCache;
    i !== null && i.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, Rt === t && (ht & n) === n && ((qt === 4 || qt === 3 && (ht & 62914560) === ht && 300 > Ce() - bs) && (At & 2) === 0 ? Va(t, 0) : Ts |= n, Oa === ht && (Oa = 0)), Tn(t);
  }
  function ng(t, e) {
    e === 0 && (e = Gh()), t = Oi(t, e), t !== null && (al(t, e), Tn(t));
  }
  function pT(t) {
    var e = t.memoizedState, n = 0;
    e !== null && (n = e.retryLane), ng(t, n);
  }
  function ST(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var i = t.stateNode, u = t.memoizedState;
        u !== null && (n = u.retryLane);
        break;
      case 19:
        i = t.stateNode;
        break;
      case 22:
        i = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    i !== null && i.delete(e), ng(t, n);
  }
  function TT(t, e) {
    return zo(t, e);
  }
  var wa = null, Ba = null, Cc = !1, zs = !1, Oc = !1, di = 0;
  function Tn(t) {
    t !== Ba && t.next === null && (Ba === null ? wa = Ba = t : Ba = Ba.next = t), zs = !0, Cc || (Cc = !0, ET());
  }
  function Ll(t, e) {
    if (!Oc && zs) {
      Oc = !0;
      do
        for (var n = !1, i = wa; i !== null; ) {
          if (t !== 0) {
            var u = i.pendingLanes;
            if (u === 0) var s = 0;
            else {
              var f = i.suspendedLanes, y = i.pingedLanes;
              s = (1 << 31 - ze(42 | t) + 1) - 1, s &= u & ~(f & ~y), s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0;
            }
            s !== 0 && (n = !0, ug(i, s));
          } else
            s = ht, s = Tu(
              i,
              i === Rt ? s : 0,
              i.cancelPendingCommit !== null || i.timeoutHandle !== -1
            ), (s & 3) === 0 || il(i, s) || (n = !0, ug(i, s));
          i = i.next;
        }
      while (n);
      Oc = !1;
    }
  }
  function bT() {
    ig();
  }
  function ig() {
    zs = Cc = !1;
    var t = 0;
    di !== 0 && VT() && (t = di);
    for (var e = Ce(), n = null, i = wa; i !== null; ) {
      var u = i.next, s = ag(i, e);
      s === 0 ? (i.next = null, n === null ? wa = u : n.next = u, u === null && (Ba = n)) : (n = i, (t !== 0 || (s & 3) !== 0) && (zs = !0)), i = u;
    }
    jt !== 0 && jt !== 5 || Ll(t), di !== 0 && (di = 0);
  }
  function ag(t, e) {
    for (var n = t.suspendedLanes, i = t.pingedLanes, u = t.expirationTimes, s = t.pendingLanes & -62914561; 0 < s; ) {
      var f = 31 - ze(s), y = 1 << f, T = u[f];
      T === -1 ? ((y & n) === 0 || (y & i) !== 0) && (u[f] = j1(y, e)) : T <= e && (t.expiredLanes |= y), s &= ~y;
    }
    if (e = Rt, n = ht, n = Tu(
      t,
      t === e ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), i = t.callbackNode, n === 0 || t === e && (Mt === 2 || Mt === 9) || t.cancelPendingCommit !== null)
      return i !== null && i !== null && Ro(i), t.callbackNode = null, t.callbackPriority = 0;
    if ((n & 3) === 0 || il(t, n)) {
      if (e = n & -n, e === t.callbackPriority) return e;
      switch (i !== null && Ro(i), Vo(n)) {
        case 2:
        case 8:
          n = Lh;
          break;
        case 32:
          n = gu;
          break;
        case 268435456:
          n = jh;
          break;
        default:
          n = gu;
      }
      return i = lg.bind(null, t), n = zo(n, i), t.callbackPriority = e, t.callbackNode = n, e;
    }
    return i !== null && i !== null && Ro(i), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function lg(t, e) {
    if (jt !== 0 && jt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var n = t.callbackNode;
    if (Os() && t.callbackNode !== n)
      return null;
    var i = ht;
    return i = Tu(
      t,
      t === Rt ? i : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), i === 0 ? null : (Qy(t, i, e), ag(t, Ce()), t.callbackNode != null && t.callbackNode === n ? lg.bind(null, t) : null);
  }
  function ug(t, e) {
    if (Os()) return null;
    Qy(t, e, !0);
  }
  function ET() {
    wT(function() {
      (At & 6) !== 0 ? zo(
        Hh,
        bT
      ) : ig();
    });
  }
  function zc() {
    if (di === 0) {
      var t = Ui;
      t === 0 && (t = vu, vu <<= 1, (vu & 261888) === 0 && (vu = 256)), di = t;
    }
    return di;
  }
  function sg(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Mu(t);
  }
  function AT(t, e, n, i, u) {
    if (e === "submit" && n && n.stateNode === u) {
      var s = sg(
        (u[be] || null).action
      ), f = i.submitter;
      f && (e = (e = f[be] || null) ? sg(e.formAction) : f.getAttribute("formAction"), e !== null && (s = e, f = null));
      var y = new zu(
        "action",
        "action",
        null,
        i,
        u
      );
      t.push({
        event: y,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (i.defaultPrevented) {
                if (di !== 0) {
                  var T = new FormData(u, f);
                  Hr(
                    n,
                    {
                      pending: !0,
                      data: T,
                      method: u.method,
                      action: s
                    },
                    null,
                    T
                  );
                }
              } else
                typeof s == "function" && (y.preventDefault(), T = new FormData(u, f), Hr(
                  n,
                  {
                    pending: !0,
                    data: T,
                    method: u.method,
                    action: s
                  },
                  s,
                  T
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var Rc = 0; Rc < er.length; Rc++) {
    var _c = er[Rc], DT = _c.toLowerCase(), MT = _c[0].toUpperCase() + _c.slice(1);
    We(
      DT,
      "on" + MT
    );
  }
  We(Vd, "onAnimationEnd"), We(Ud, "onAnimationIteration"), We(wd, "onAnimationStart"), We("dblclick", "onDoubleClick"), We("focusin", "onFocus"), We("focusout", "onBlur"), We(US, "onTransitionRun"), We(wS, "onTransitionStart"), We(BS, "onTransitionCancel"), We(Bd, "onTransitionEnd"), aa("onMouseEnter", ["mouseout", "mouseover"]), aa("onMouseLeave", ["mouseout", "mouseover"]), aa("onPointerEnter", ["pointerout", "pointerover"]), aa("onPointerLeave", ["pointerout", "pointerover"]), Mi(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Mi(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Mi("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Mi(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Mi(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Mi(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var jl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), xT = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(jl)
  );
  function og(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var i = t[n], u = i.event;
      i = i.listeners;
      t: {
        var s = void 0;
        if (e)
          for (var f = i.length - 1; 0 <= f; f--) {
            var y = i[f], T = y.instance, x = y.currentTarget;
            if (y = y.listener, T !== s && u.isPropagationStopped())
              break t;
            s = y, u.currentTarget = x;
            try {
              s(u);
            } catch (z) {
              Nu(z);
            }
            u.currentTarget = null, s = T;
          }
        else
          for (f = 0; f < i.length; f++) {
            if (y = i[f], T = y.instance, x = y.currentTarget, y = y.listener, T !== s && u.isPropagationStopped())
              break t;
            s = y, u.currentTarget = x;
            try {
              s(u);
            } catch (z) {
              Nu(z);
            }
            u.currentTarget = null, s = T;
          }
      }
    }
  }
  function ft(t, e) {
    var n = e[Jh];
    n === void 0 && (n = e[Jh] = /* @__PURE__ */ new Set());
    var i = t + "__bubble";
    n.has(i) || (rg(e, t, 2, !1), n.add(i));
  }
  function Nc(t, e, n) {
    var i = 0;
    e && (i |= 4), rg(
      n,
      t,
      i,
      e
    );
  }
  var Rs = "_reactListening" + Math.random().toString(36).slice(2);
  function Vc(t) {
    if (!t[Rs]) {
      t[Rs] = !0, kh.forEach(function(n) {
        n !== "selectionchange" && (xT.has(n) || Nc(n, !1, t), Nc(n, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Rs] || (e[Rs] = !0, Nc("selectionchange", !1, e));
    }
  }
  function rg(t, e, n, i) {
    switch (Ig(e)) {
      case 2:
        var u = pb;
        break;
      case 8:
        u = Sb;
        break;
      default:
        u = $c;
    }
    n = u.bind(
      null,
      e,
      n,
      t
    ), u = void 0, !Go || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (u = !0), i ? u !== void 0 ? t.addEventListener(e, n, {
      capture: !0,
      passive: u
    }) : t.addEventListener(e, n, !0) : u !== void 0 ? t.addEventListener(e, n, {
      passive: u
    }) : t.addEventListener(e, n, !1);
  }
  function Uc(t, e, n, i, u) {
    var s = i;
    if ((e & 1) === 0 && (e & 2) === 0 && i !== null)
      t: for (; ; ) {
        if (i === null) return;
        var f = i.tag;
        if (f === 3 || f === 4) {
          var y = i.stateNode.containerInfo;
          if (y === u) break;
          if (f === 4)
            for (f = i.return; f !== null; ) {
              var T = f.tag;
              if ((T === 3 || T === 4) && f.stateNode.containerInfo === u)
                return;
              f = f.return;
            }
          for (; y !== null; ) {
            if (f = Di(y), f === null) return;
            if (T = f.tag, T === 5 || T === 6 || T === 26 || T === 27) {
              i = s = f;
              continue t;
            }
            y = y.parentNode;
          }
        }
        i = i.return;
      }
    rd(function() {
      var x = s, z = jo(n), U = [];
      t: {
        var D = Hd.get(t);
        if (D !== void 0) {
          var O = zu, j = t;
          switch (t) {
            case "keypress":
              if (Cu(n) === 0) break t;
            case "keydown":
            case "keyup":
              O = cS;
              break;
            case "focusin":
              j = "focus", O = Zo;
              break;
            case "focusout":
              j = "blur", O = Zo;
              break;
            case "beforeblur":
            case "afterblur":
              O = Zo;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              O = hd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = I1;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = yS;
              break;
            case Vd:
            case Ud:
            case wd:
              O = eS;
              break;
            case Bd:
              O = vS;
              break;
            case "scroll":
            case "scrollend":
              O = k1;
              break;
            case "wheel":
              O = SS;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = iS;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = md;
              break;
            case "submit":
              O = dS;
              break;
            case "toggle":
            case "beforetoggle":
              O = bS;
          }
          var J = (e & 4) !== 0, ut = !J && (t === "scroll" || t === "scrollend"), M = J ? D !== null ? D + "Capture" : null : D;
          J = [];
          for (var E = x, C; E !== null; ) {
            var N = E;
            if (C = N.stateNode, N = N.tag, N !== 5 && N !== 26 && N !== 27 || C === null || M === null || (N = sl(E, M), N != null && J.push(
              Yl(E, N, C)
            )), ut) break;
            E = E.return;
          }
          0 < J.length && (D = new O(
            D,
            j,
            null,
            n,
            z
          ), U.push({ event: D, listeners: J }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (O = t === "mouseover" || t === "pointerover", D = t === "mouseout" || t === "pointerout", O && n !== Lo && (j = n.relatedTarget || n.fromElement) && (Di(j) || j[ea]))
            break t;
          (D || O) && (j = z.window === z ? z : (O = z.ownerDocument) ? O.defaultView || O.parentWindow : window, D ? (O = n.relatedTarget || n.toElement, D = x, O = O ? Di(O) : null, O !== null && (ut = d(O), J = O.tag, O !== ut || J !== 5 && J !== 27 && J !== 6) && (O = null)) : (D = null, O = x), D !== O && (J = hd, N = "onMouseLeave", M = "onMouseEnter", E = "mouse", (t === "pointerout" || t === "pointerover") && (J = md, N = "onPointerLeave", M = "onPointerEnter", E = "pointer"), ut = D == null ? j : ul(D), C = O == null ? j : ul(O), j = new J(
            N,
            E + "leave",
            D,
            n,
            z
          ), j.target = ut, j.relatedTarget = C, N = null, Di(z) === x && (J = new J(
            M,
            E + "enter",
            O,
            n,
            z
          ), J.target = C, J.relatedTarget = ut, N = J), ut = N, J = D && O ? ot(
            D,
            O,
            CT
          ) : null, D !== null && cg(
            U,
            j,
            D,
            J,
            !1
          ), O !== null && ut !== null && cg(
            U,
            ut,
            O,
            J,
            !0
          )));
        }
        t: {
          if (D = x ? ul(x) : window, O = D.nodeName && D.nodeName.toLowerCase(), O === "select" || O === "input" && D.type === "file")
            var X = Ed;
          else if (Td(D))
            if (Ad)
              X = _S;
            else {
              X = zS;
              var dt = OS;
            }
          else
            O = D.nodeName, !O || O.toLowerCase() !== "input" || D.type !== "checkbox" && D.type !== "radio" ? x && Ho(x.elementType) && (X = Ed) : X = RS;
          if (X && (X = X(t, x))) {
            bd(
              U,
              X,
              n,
              z
            );
            break t;
          }
          dt && dt(t, D, x);
        }
        switch (dt = x ? ul(x) : window, t) {
          case "focusin":
            (Td(dt) || dt.contentEditable === "true") && (ca = dt, Io = x, yl = null);
            break;
          case "focusout":
            yl = Io = ca = null;
            break;
          case "mousedown":
            $o = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            $o = !1, _d(U, n, z);
            break;
          case "selectionchange":
            if (VS) break;
          case "keydown":
          case "keyup":
            _d(U, n, z);
        }
        var W;
        if (Jo)
          t: {
            switch (t) {
              case "compositionstart":
                var et = "onCompositionStart";
                break t;
              case "compositionend":
                et = "onCompositionEnd";
                break t;
              case "compositionupdate":
                et = "onCompositionUpdate";
                break t;
            }
            et = void 0;
          }
        else
          ra ? pd(t, n) && (et = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (et = "onCompositionStart");
        et && (yd && n.locale !== "ko" && (ra || et !== "onCompositionStart" ? et === "onCompositionEnd" && ra && (W = cd()) : (Pn = z, qo = "value" in Pn ? Pn.value : Pn.textContent, ra = !0)), dt = _s(x, et), 0 < dt.length && (et = new dd(
          et,
          t,
          null,
          n,
          z
        ), U.push({ event: et, listeners: dt }), W ? et.data = W : (W = Sd(n), W !== null && (et.data = W)))), (W = AS ? DS(t, n) : MS(t, n)) && (et = _s(x, "onBeforeInput"), 0 < et.length && (dt = new dd(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          z
        ), U.push({
          event: dt,
          listeners: et
        }), dt.data = W)), AT(
          U,
          t,
          x,
          n,
          z
        );
      }
      og(U, e);
    });
  }
  function Yl(t, e, n) {
    return {
      instance: t,
      listener: e,
      currentTarget: n
    };
  }
  function _s(t, e) {
    for (var n = e + "Capture", i = []; t !== null; ) {
      var u = t, s = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || s === null || (u = sl(t, n), u != null && i.unshift(
        Yl(t, u, s)
      ), u = sl(t, e), u != null && i.push(
        Yl(t, u, s)
      )), t.tag === 3) return i;
      t = t.return;
    }
    return [];
  }
  function CT(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function cg(t, e, n, i, u) {
    for (var s = e._reactName, f = []; n !== null && n !== i; ) {
      var y = n, T = y.alternate, x = y.stateNode;
      if (y = y.tag, T !== null && T === i) break;
      y !== 5 && y !== 26 && y !== 27 || x === null || (T = x, u ? (x = sl(n, s), x != null && f.unshift(
        Yl(n, x, T)
      )) : u || (x = sl(n, s), x != null && f.push(
        Yl(n, x, T)
      ))), n = n.return;
    }
    f.length !== 0 && t.push({ event: e, listeners: f });
  }
  var OT = /\r\n?/g, zT = /\u0000|\uFFFD/g;
  function fg(t) {
    return (typeof t == "string" ? t : "" + t).replace(OT, `
`).replace(zT, "");
  }
  function hg(t, e) {
    return e = fg(e), fg(t) === e;
  }
  function Ct(t, e, n, i, u, s) {
    switch (n) {
      case "children":
        if (typeof i == "string")
          e === "body" || e === "textarea" && i === "" || ua(t, i);
        else if (typeof i == "number" || typeof i == "bigint")
          e !== "body" && ua(t, "" + i);
        else return;
        break;
      case "className":
        Du(t, "class", i);
        break;
      case "tabIndex":
        Du(t, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Du(t, n, i);
        break;
      case "style":
        sd(t, i, s);
        return;
      case "data":
        if (e !== "object") {
          Du(t, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = Mu(i), t.setAttribute(n, i);
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof s == "function" && (n === "formAction" ? (e !== "input" && Ct(t, e, "name", u.name, u, null), Ct(
            t,
            e,
            "formEncType",
            u.formEncType,
            u,
            null
          ), Ct(
            t,
            e,
            "formMethod",
            u.formMethod,
            u,
            null
          ), Ct(
            t,
            e,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : (Ct(t, e, "encType", u.encType, u, null), Ct(t, e, "method", u.method, u, null), Ct(t, e, "target", u.target, u, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = Mu(i), t.setAttribute(n, i);
        break;
      case "onClick":
        i != null && (t.onclick = cn);
        return;
      case "onScroll":
        i != null && ft("scroll", t);
        return;
      case "onScrollEnd":
        i != null && ft("scrollend", t);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(r(61));
          if (n = i.__html, n != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "multiple":
        t.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        t.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        n = Mu(i), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        i === !0 ? t.setAttribute(n, "") : i !== !1 && i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? t.removeAttribute(n) : t.setAttribute(n, i);
        break;
      case "popover":
        ft("beforetoggle", t), ft("toggle", t), Au(t, "popover", i);
        break;
      case "xlinkActuate":
        zn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          i
        );
        break;
      case "xlinkArcrole":
        zn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          i
        );
        break;
      case "xlinkRole":
        zn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          i
        );
        break;
      case "xlinkShow":
        zn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          i
        );
        break;
      case "xlinkTitle":
        zn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          i
        );
        break;
      case "xlinkType":
        zn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          i
        );
        break;
      case "xmlBase":
        zn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          i
        );
        break;
      case "xmlLang":
        zn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          i
        );
        break;
      case "xmlSpace":
        zn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          i
        );
        break;
      case "is":
        Au(t, "is", i);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N")
          n = P1.get(n) || n, Au(t, n, i);
        else return;
    }
    Tt = !0;
  }
  function wc(t, e, n, i, u, s) {
    switch (n) {
      case "style":
        sd(t, i, s);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(r(61));
          if (n = i.__html, n != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "children":
        if (typeof i == "string") ua(t, i);
        else if (typeof i == "number" || typeof i == "bigint")
          ua(t, "" + i);
        else return;
        break;
      case "onScroll":
        i != null && ft("scroll", t);
        return;
      case "onScrollEnd":
        i != null && ft("scrollend", t);
        return;
      case "onClick":
        i != null && (t.onclick = cn);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!Wh.hasOwnProperty(n))
          t: {
            if (n[0] === "o" && n[1] === "n" && (u = n.endsWith("Capture"), s = n.slice(2, u ? n.length - 7 : void 0), e = t[be] || null, e = e != null ? e[n] : null, typeof e == "function" && t.removeEventListener(s, e, u), typeof i == "function")) {
              typeof e != "function" && e !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(s, i, u);
              break t;
            }
            Tt = !0, n in t ? t[n] = i : i === !0 ? t.setAttribute(n, "") : Au(t, n, i);
          }
        return;
    }
    Tt = !0;
  }
  function oe(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        ft("error", t), ft("load", t);
        var i = !1, u = !1, s;
        for (s in n)
          if (n.hasOwnProperty(s)) {
            var f = n[s];
            if (f != null)
              switch (s) {
                case "src":
                  i = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, e));
                default:
                  Ct(t, e, s, f, n, null);
              }
          }
        u && Ct(t, e, "srcSet", n.srcSet, n, null), i && Ct(t, e, "src", n.src, n, null);
        return;
      case "input":
        ft("invalid", t);
        var y = s = f = u = null, T = null, x = null;
        for (i in n)
          if (n.hasOwnProperty(i)) {
            var z = n[i];
            if (z != null)
              switch (i) {
                case "name":
                  u = z;
                  break;
                case "type":
                  f = z;
                  break;
                case "checked":
                  T = z;
                  break;
                case "defaultChecked":
                  x = z;
                  break;
                case "value":
                  s = z;
                  break;
                case "defaultValue":
                  y = z;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (z != null)
                    throw Error(r(137, e));
                  break;
                default:
                  Ct(t, e, i, z, n, null);
              }
          }
        id(
          t,
          s,
          y,
          T,
          x,
          f,
          u,
          !1
        );
        return;
      case "select":
        ft("invalid", t), i = f = s = null;
        for (u in n)
          if (n.hasOwnProperty(u) && (y = n[u], y != null))
            switch (u) {
              case "value":
                s = y;
                break;
              case "defaultValue":
                f = y;
                break;
              case "multiple":
                i = y;
              default:
                Ct(t, e, u, y, n, null);
            }
        e = s, n = f, t.multiple = !!i, e != null ? la(t, !!i, e, !1) : n != null && la(t, !!i, n, !0);
        return;
      case "textarea":
        ft("invalid", t), s = u = i = null;
        for (f in n)
          if (n.hasOwnProperty(f) && (y = n[f], y != null))
            switch (f) {
              case "value":
                i = y;
                break;
              case "defaultValue":
                u = y;
                break;
              case "children":
                s = y;
                break;
              case "dangerouslySetInnerHTML":
                if (y != null) throw Error(r(91));
                break;
              default:
                Ct(t, e, f, y, n, null);
            }
        ld(t, i, u, s);
        return;
      case "option":
        for (T in n)
          n.hasOwnProperty(T) && (i = n[T], i != null) && (T === "selected" ? t.selected = i && typeof i != "function" && typeof i != "symbol" : Ct(t, e, T, i, n, null));
        return;
      case "dialog":
        ft("beforetoggle", t), ft("toggle", t), ft("cancel", t), ft("close", t);
        break;
      case "iframe":
      case "object":
        ft("load", t);
        break;
      case "video":
      case "audio":
        for (i = 0; i < jl.length; i++)
          ft(jl[i], t);
        break;
      case "image":
        ft("error", t), ft("load", t);
        break;
      case "details":
        ft("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        ft("error", t), ft("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (x in n)
          if (n.hasOwnProperty(x) && (i = n[x], i != null))
            switch (x) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                Ct(t, e, x, i, n, null);
            }
        return;
      default:
        if (Ho(e)) {
          for (z in n)
            n.hasOwnProperty(z) && (i = n[z], i !== void 0 && wc(
              t,
              e,
              z,
              i,
              n,
              void 0
            ));
          return;
        }
    }
    for (y in n)
      n.hasOwnProperty(y) && (i = n[y], i != null && Ct(t, e, y, i, n, null));
  }
  var RT = {};
  function _T(t, e, n, i) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null, s = null, f = null, y = null, T = null, x = null, z = null;
        for (O in n) {
          var U = n[O];
          if (n.hasOwnProperty(O) && U != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                T = U;
              default:
                i.hasOwnProperty(O) || Ct(t, e, O, null, i, U);
            }
        }
        for (var D in i) {
          var O = i[D];
          if (U = n[D], i.hasOwnProperty(D) && (O != null || U != null))
            switch (D) {
              case "type":
                O !== U && (Tt = !0), s = O;
                break;
              case "name":
                O !== U && (Tt = !0), u = O;
                break;
              case "checked":
                O !== U && (Tt = !0), x = O;
                break;
              case "defaultChecked":
                O !== U && (Tt = !0), z = O;
                break;
              case "value":
                O !== U && (Tt = !0), f = O;
                break;
              case "defaultValue":
                O !== U && (Tt = !0), y = O;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(r(137, e));
                break;
              default:
                O !== U && Ct(
                  t,
                  e,
                  D,
                  O,
                  i,
                  U
                );
            }
        }
        wo(
          t,
          f,
          y,
          T,
          x,
          z,
          s,
          u
        );
        return;
      case "select":
        O = f = y = D = null;
        for (s in n)
          if (T = n[s], n.hasOwnProperty(s) && T != null)
            switch (s) {
              case "value":
                break;
              case "multiple":
                O = T;
              default:
                i.hasOwnProperty(s) || Ct(
                  t,
                  e,
                  s,
                  null,
                  i,
                  T
                );
            }
        for (u in i)
          if (s = i[u], T = n[u], i.hasOwnProperty(u) && (s != null || T != null))
            switch (u) {
              case "value":
                s !== T && (Tt = !0), D = s;
                break;
              case "defaultValue":
                s !== T && (Tt = !0), y = s;
                break;
              case "multiple":
                s !== T && (Tt = !0), f = s;
              default:
                s !== T && Ct(
                  t,
                  e,
                  u,
                  s,
                  i,
                  T
                );
            }
        e = y, n = f, i = O, D != null ? la(t, !!n, D, !1) : !!i != !!n && (e != null ? la(t, !!n, e, !0) : la(t, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        O = D = null;
        for (y in n)
          if (u = n[y], n.hasOwnProperty(y) && u != null && !i.hasOwnProperty(y))
            switch (y) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ct(t, e, y, null, i, u);
            }
        for (f in i)
          if (u = i[f], s = n[f], i.hasOwnProperty(f) && (u != null || s != null))
            switch (f) {
              case "value":
                u !== s && (Tt = !0), D = u;
                break;
              case "defaultValue":
                u !== s && (Tt = !0), O = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(r(91));
                break;
              default:
                u !== s && Ct(t, e, f, u, i, s);
            }
        ad(t, D, O);
        return;
      case "option":
        for (var j in n)
          D = n[j], n.hasOwnProperty(j) && D != null && !i.hasOwnProperty(j) && (j === "selected" ? t.selected = !1 : Ct(
            t,
            e,
            j,
            null,
            i,
            D
          ));
        for (T in i)
          D = i[T], O = n[T], i.hasOwnProperty(T) && D !== O && (D != null || O != null) && (T === "selected" ? (D !== O && (Tt = !0), t.selected = D && typeof D != "function" && typeof D != "symbol") : Ct(
            t,
            e,
            T,
            D,
            i,
            O
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var J in n)
          D = n[J], n.hasOwnProperty(J) && D != null && !i.hasOwnProperty(J) && Ct(t, e, J, null, i, D);
        for (x in i)
          if (D = i[x], O = n[x], i.hasOwnProperty(x) && D !== O && (D != null || O != null))
            switch (x) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(r(137, e));
                break;
              default:
                Ct(
                  t,
                  e,
                  x,
                  D,
                  i,
                  O
                );
            }
        return;
      default:
        if (Ho(e)) {
          for (var ut in n)
            D = n[ut], n.hasOwnProperty(ut) && D !== void 0 && !i.hasOwnProperty(ut) && wc(
              t,
              e,
              ut,
              void 0,
              i,
              D
            );
          for (z in i)
            D = i[z], O = n[z], !i.hasOwnProperty(z) || D === O || D === void 0 && O === void 0 || wc(
              t,
              e,
              z,
              D,
              i,
              O
            );
          return;
        }
    }
    for (var M in n)
      D = n[M], n.hasOwnProperty(M) && D != null && !i.hasOwnProperty(M) && Ct(t, e, M, null, i, D);
    for (U in i)
      D = i[U], O = n[U], !i.hasOwnProperty(U) || D === O || D == null && O == null || Ct(t, e, U, D, i, O);
  }
  function dg(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function NT() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), i = 0; i < n.length; i++) {
        var u = n[i], s = u.transferSize, f = u.initiatorType, y = u.duration;
        if (s && y && dg(f)) {
          for (f = 0, y = u.responseEnd, i += 1; i < n.length; i++) {
            var T = n[i], x = T.startTime;
            if (x > y) break;
            var z = T.transferSize, U = T.initiatorType;
            z && dg(U) && (T = T.responseEnd, f += z * (T < y ? 1 : (y - x) / (T - x)));
          }
          if (--i, e += 8 * (s + f) / (u.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Bc = null, Hc = null;
  function Gl(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function mg(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function yg(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function gg(t, e, n, i) {
    return n = Gl(
      n
    ).createElement(t), n[ie] = i, n[be] = e, oe(n, t, e), It(n), n;
  }
  function Lc(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var jc = null;
  function VT() {
    var t = window.event;
    return t && t.type === "popstate" ? t === jc ? !1 : (jc = t, !0) : (jc = null, !1);
  }
  var Yc = typeof setTimeout == "function" ? setTimeout : void 0, UT = typeof clearTimeout == "function" ? clearTimeout : void 0, vg = typeof Promise == "function" ? Promise : void 0, pg = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Yc, wT = typeof queueMicrotask == "function" ? queueMicrotask : typeof vg < "u" ? function(t) {
    return vg.resolve(null).then(t).catch(BT);
  } : Yc;
  function BT(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function mi(t) {
    return t === "head";
  }
  function Sg(t, e) {
    var n = e, i = 0;
    do {
      var u = n.nextSibling;
      if (t.removeChild(n), u && u.nodeType === 8)
        if (n = u.data, n === "/$" || n === "/&") {
          if (i === 0) {
            t.removeChild(u), Xa(e);
            return;
          }
          i--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          i++;
        else if (n === "html")
          Pc(
            t.ownerDocument.documentElement
          );
        else if (n === "head") {
          n = t.ownerDocument.head, Pc(n);
          for (var s = n.firstChild; s; ) {
            var f = s.nextSibling, y = s.nodeName;
            s[ll] || y === "SCRIPT" || y === "STYLE" || y === "LINK" && s.rel.toLowerCase() === "stylesheet" || n.removeChild(s), s = f;
          }
        } else
          n === "body" && Pc(t.ownerDocument.body);
      n = u;
    } while (n);
    Xa(e);
  }
  function Tg(t, e) {
    var n = t;
    t = 0;
    do {
      var i = n.nextSibling;
      if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), i && i.nodeType === 8)
        if (n = i.data, n === "/$") {
          if (t === 0) break;
          t--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
      n = i;
    } while (n);
  }
  function bg(t, e, n) {
    if (e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e, t.style.viewTransitionName = e, n != null && (t.style.viewTransitionClass = n), n = getComputedStyle(t), n.display === "inline") {
      if (e = t.getClientRects(), e.length === 1) var i = 1;
      else
        for (var u = i = 0; u < e.length; u++) {
          var s = e[u];
          0 < s.width && 0 < s.height && i++;
        }
      i === 1 && (t = t.style, t.display = e.length === 1 ? "inline-block" : "block", t.marginTop = "-" + n.paddingTop, t.marginBottom = "-" + n.paddingBottom);
    }
  }
  function Eg(t, e) {
    t = t.style, e = e.style;
    var n = e != null ? e.hasOwnProperty("viewTransitionName") ? e.viewTransitionName : e.hasOwnProperty("view-transition-name") ? e["view-transition-name"] : null : null;
    t.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = e != null ? e.hasOwnProperty("viewTransitionClass") ? e.viewTransitionClass : e.hasOwnProperty("view-transition-class") ? e["view-transition-class"] : null : null, t.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), t.display === "inline-block" && (e == null ? t.display = t.margin = "" : (n = e.display, t.display = n == null || typeof n == "boolean" ? "" : n, n = e.margin, n != null ? t.margin = n : (n = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"], t.marginTop = n == null || typeof n == "boolean" ? "" : n, e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"], t.marginBottom = e == null || typeof e == "boolean" ? "" : e)));
  }
  function HT(t, e, n) {
    return n = n.ownerDocument.defaultView, {
      rect: t,
      abs: e.position === "absolute" || e.position === "fixed",
      clip: e.clipPath !== "none" || e.overflow !== "visible" || e.filter !== "none" || e.mask !== "none" || e.mask !== "none" || e.borderRadius !== "0px",
      view: 0 <= t.bottom && 0 <= t.right && t.top <= n.innerHeight && t.left <= n.innerWidth
    };
  }
  function Gc(t) {
    var e = t.getBoundingClientRect(), n = getComputedStyle(t);
    return HT(e, n, t);
  }
  function LT(t) {
    return t.documentElement.clientHeight;
  }
  function jT(t) {
    this.addEventListener("load", t), this.addEventListener("error", t);
  }
  function YT(t, e, n, i, u, s, f, y, T) {
    var x = e.nodeType === 9 ? e : e.ownerDocument;
    try {
      var z = x.startViewTransition({
        update: function() {
          var D = x.defaultView, O = D.navigation && D.navigation.transition, j = x.fonts.status;
          i();
          var J = [];
          if (j === "loaded" && (LT(x), x.fonts.status === "loading" && J.push(x.fonts.ready)), j = J.length, t !== null)
            for (var ut = t.suspenseyImages, M = 0, E = 0; E < ut.length; E++) {
              var C = ut[E];
              if (!C.complete) {
                var N = C.getBoundingClientRect();
                if (0 < N.bottom && 0 < N.right && N.top < D.innerHeight && N.left < D.innerWidth) {
                  if (M += Xg(C), M > Us) {
                    J.length = j;
                    break;
                  }
                  C = new Promise(
                    jT.bind(C)
                  ), J.push(C);
                }
              }
            }
          if (0 < J.length)
            return D = Promise.race([
              Promise.all(J),
              new Promise(function(X) {
                return setTimeout(X, 500);
              })
            ]).then(u, u), (O ? Promise.allSettled([O.finished, D]) : D).then(s, s);
          if (u(), O)
            return O.finished.then(
              s,
              s
            );
          s();
        },
        types: n
      });
      x.__reactViewTransition = z;
      var U = [];
      return z.ready.then(
        function() {
          for (var D = x.documentElement.getAnimations({
            subtree: !0
          }), O = 0; O < D.length; O++) {
            var j = D[O], J = j.effect, ut = J.pseudoElement;
            if (ut != null && ut.startsWith("::view-transition")) {
              U.push(j), j = J.getKeyframes();
              for (var M = ut = void 0, E = !0, C = 0; C < j.length; C++) {
                var N = j[C], X = N.width;
                if (ut === void 0) ut = X;
                else if (ut !== X) {
                  E = !1;
                  break;
                }
                if (X = N.height, M === void 0) M = X;
                else if (M !== X) {
                  E = !1;
                  break;
                }
                delete N.width, delete N.height, N.transform === "none" && delete N.transform;
              }
              E && ut !== void 0 && M !== void 0 && (J.setKeyframes(j), E = getComputedStyle(
                J.target,
                J.pseudoElement
              ), E.width !== ut || E.height !== M) && (E = j[0], E.width = ut, E.height = M, E = j[j.length - 1], E.width = ut, E.height = M, J.setKeyframes(j));
            }
          }
          f();
        },
        function(D) {
          x.__reactViewTransition === z && (x.__reactViewTransition = null);
          try {
            typeof D == "object" && D !== null && D.name === "InvalidStateError" && (D.message === "View transition was skipped because document visibility state is hidden." || D.message === "Skipping view transition because document visibility state has become hidden." || D.message === "Skipping view transition because viewport size changed." || D.message === "Transition was aborted because of invalid state") && (D = null), D !== null && T(D);
          } finally {
            i(), u(), f();
          }
        }
      ), z.finished.finally(function() {
        for (var D = 0; D < U.length; D++)
          U[D].cancel();
        x.__reactViewTransition === z && (x.__reactViewTransition = null), y();
      }), z;
    } catch {
      return i(), u(), f(), null;
    }
  }
  function Zi(t, e) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + e + ")";
  }
  Zi.prototype.animate = function(t, e) {
    return e = typeof e == "number" ? { duration: e } : w({}, e), e.pseudoElement = this._selector, this._scope.animate(t, e);
  }, Zi.prototype.getAnimations = function() {
    for (var t = this._scope, e = this._selector, n = t.getAnimations({ subtree: !0 }), i = [], u = 0; u < n.length; u++) {
      var s = n[u].effect;
      s !== null && s.target === t && s.pseudoElement === e && i.push(n[u]);
    }
    return i;
  }, Zi.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Ag(t) {
    return {
      name: t,
      group: new Zi("group", t),
      imagePair: new Zi("image-pair", t),
      old: new Zi("old", t),
      new: new Zi("new", t)
    };
  }
  function He(t) {
    this._fragmentFiber = t, this._observers = this._eventListeners = null;
  }
  He.prototype.addEventListener = function(t, e, n) {
    var i = null, u = null;
    if (!(n != null && typeof n != "boolean" && (i = n.signal || null, i !== null && i.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var s = this._eventListeners;
      if (Mg(s, t, e, n) === -1) {
        var f = this, y = e;
        n != null && typeof n != "boolean" && n.once === !0 && (y = function(T) {
          f.removeEventListener(
            t,
            e,
            n
          ), typeof e == "function" ? e.call(this, T) : e.handleEvent(T);
        }), i !== null && (u = f.removeEventListener.bind(
          f,
          t,
          e,
          n
        ), i.addEventListener("abort", u, { once: !0 }), u = i.removeEventListener.bind(i, "abort", u)), i = Ha(n), s.push({
          type: t,
          listener: e,
          optionsOrUseCapture: n,
          attachedListener: y,
          cleanup: u
        }), g(
          this._fragmentFiber.child,
          !1,
          GT,
          t,
          y,
          i
        );
      }
      this._eventListeners = s;
    }
  };
  function GT(t, e, n, i) {
    return V(t).addEventListener(
      e,
      n,
      i
    ), !1;
  }
  He.prototype.removeEventListener = function(t, e, n) {
    var i = this._eventListeners;
    if (i !== null && (e = Mg(
      i,
      t,
      e,
      n
    ), e !== -1)) {
      var u = i[e];
      n = u.attachedListener;
      var s = u.cleanup;
      u = Ha(u.optionsOrUseCapture), g(
        this._fragmentFiber.child,
        !1,
        qT,
        t,
        n,
        u
      ), i.splice(e, 1), s !== null && s();
    }
  };
  function qT(t, e, n, i) {
    return V(t).removeEventListener(
      e,
      n,
      i
    ), !1;
  }
  function Ha(t) {
    return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
  }
  function Dg(t) {
    return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
  }
  function Mg(t, e, n, i) {
    if (t.length === 0) return -1;
    i = Dg(i);
    for (var u = 0; u < t.length; u++) {
      var s = t[u];
      if (s.type === e && s.listener === n && Dg(s.optionsOrUseCapture) === i)
        return u;
    }
    return -1;
  }
  He.prototype.dispatchEvent = function(t) {
    var e = b(
      this._fragmentFiber
    );
    if (e === null) return !0;
    e = V(e);
    var n = this._eventListeners;
    if (n !== null && 0 < n.length || !t.bubbles) {
      var i = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
      if (n)
        for (var u = 0; u < n.length; u++) {
          var s = n[u];
          i.addEventListener(
            s.type,
            s.attachedListener,
            Ha(s.optionsOrUseCapture)
          );
        }
      if (e.appendChild(i), t = i.dispatchEvent(t), n)
        for (u = 0; u < n.length; u++)
          s = n[u], i.removeEventListener(
            s.type,
            s.attachedListener,
            Ha(s.optionsOrUseCapture)
          );
      return e.removeChild(i), t;
    }
    return e.dispatchEvent(t);
  }, He.prototype.focus = function(t) {
    g(
      this._fragmentFiber.child,
      !0,
      xg,
      t,
      void 0,
      void 0
    );
  };
  function xg(t, e) {
    return t.tag === 6 ? !1 : (t = V(t), tb(t, e));
  }
  He.prototype.focusLast = function(t) {
    var e = [];
    g(
      this._fragmentFiber.child,
      !0,
      qc,
      e,
      void 0,
      void 0
    );
    for (var n = e.length - 1; 0 <= n && !xg(e[n], t); n--) ;
  };
  function qc(t, e) {
    return e.push(t), !1;
  }
  He.prototype.blur = function() {
    var t = b(
      this._fragmentFiber
    );
    t !== null && (t = V(t), t = Gl(t).activeElement, t !== null && g(
      this._fragmentFiber.child,
      !1,
      XT,
      t,
      void 0,
      void 0
    ));
  };
  function XT(t, e) {
    return t.tag === 6 ? !1 : (t = V(t), t === e || t.contains(e) ? (e.blur(), !0) : !1);
  }
  He.prototype.observeUsing = function(t) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), g(
      this._fragmentFiber.child,
      !1,
      QT,
      t,
      void 0,
      void 0
    );
  };
  function QT(t, e) {
    return t.tag === 6 || (t = V(t), e.observe(t)), !1;
  }
  He.prototype.unobserveUsing = function(t) {
    var e = this._observers;
    if (e !== null && e.has(t)) {
      e.delete(t), g(
        this._fragmentFiber.child,
        !1,
        ZT,
        t,
        void 0,
        void 0
      );
      for (var n = e = 0; n < nn.length; n++) {
        var i = nn[n];
        i.fragmentInstance === this && i.observer === t ? t.unobserve(i.instance) : nn[e++] = i;
      }
      nn.length = e;
    }
  };
  function ZT(t, e) {
    return t.tag === 6 || (t = V(t), e.unobserve(t)), !1;
  }
  var nn = [], Xc = !1;
  function KT(t, e, n) {
    nn.push({
      fragmentInstance: t,
      observer: e,
      instance: n
    }), Xc || (Xc = !0, eb(function() {
      Xc = !1;
      var i = nn;
      nn = [];
      for (var u = 0; u < i.length; u++) {
        var s = i[u];
        s.observer.unobserve(s.instance);
      }
    }));
  }
  He.prototype.getClientRects = function() {
    var t = [];
    return g(
      this._fragmentFiber.child,
      !1,
      JT,
      t,
      void 0,
      void 0
    ), t;
  };
  function JT(t, e) {
    if (t.tag === 6) {
      t = t.stateNode;
      var n = t.ownerDocument.createRange();
      n.selectNodeContents(t), e.push.apply(e, n.getClientRects());
    } else
      t = V(t), e.push.apply(e, t.getClientRects());
    return !1;
  }
  He.prototype.getRootNode = function(t) {
    var e = b(
      this._fragmentFiber
    );
    return e === null ? this : V(e).getRootNode(t);
  }, He.prototype.compareDocumentPosition = function(t) {
    var e = b(
      this._fragmentFiber
    );
    if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var n = [];
    g(
      this._fragmentFiber.child,
      !1,
      qc,
      n,
      void 0,
      void 0
    );
    var i = V(e);
    if (n.length === 0) {
      if (n = i, _(this._fragmentFiber)) {
        t: {
          for (e = this._fragmentFiber.return; e !== null; ) {
            if (e.tag === 4) {
              e = e.stateNode.containerInfo;
              break t;
            }
            if (e.tag === 3 || e.tag === 5 || e.tag === 27)
              break;
            e = e.return;
          }
          e = null;
        }
        e != null && (n = e);
      }
      e = this._fragmentFiber;
      var u = i = n.compareDocumentPosition(t);
      return n === t ? u = Node.DOCUMENT_POSITION_CONTAINS : i & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = R(e)[1], n === null ? u = Node.DOCUMENT_POSITION_PRECEDING : (t = V(n).compareDocumentPosition(
        t
      ), u = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    e = V(n[0]), u = V(n[n.length - 1]);
    var s = _(this._fragmentFiber) ? e.parentElement : i;
    if (s == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    i = s.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY, s = s.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var f = e.compareDocumentPosition(t), y = u.compareDocumentPosition(t), T = f & Node.DOCUMENT_POSITION_CONTAINED_BY || y & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return y = i && s && f & Node.DOCUMENT_POSITION_FOLLOWING && y & Node.DOCUMENT_POSITION_PRECEDING, e = i && e === t || s && u === t || T || y ? Node.DOCUMENT_POSITION_CONTAINED_BY : !i && e === t || !s && u === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : f, e & Node.DOCUMENT_POSITION_DISCONNECTED || e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || PT(
      e,
      this._fragmentFiber,
      n[0],
      n[n.length - 1],
      t
    ) ? e : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function PT(t, e, n, i, u) {
    var s = Di(u);
    if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (n = !!s)
        t: {
          for (; s !== null; ) {
            if (s.tag === 7 && (s === e || s.alternate === e)) {
              n = !0;
              break t;
            }
            s = s.return;
          }
          n = !1;
        }
      return n;
    }
    if (t & Node.DOCUMENT_POSITION_CONTAINS) {
      if (s === null)
        return s = u.ownerDocument, u === s || u === s.documentElement || u === s.body;
      t: {
        for (s = e, e = b(e); s !== null; ) {
          if (!(s.tag !== 5 && s.tag !== 3 && s.tag !== 27 || s !== e && s.alternate !== e)) {
            s = !0;
            break t;
          }
          s = s.return;
        }
        s = !1;
      }
      return s;
    }
    return t & Node.DOCUMENT_POSITION_PRECEDING ? ((e = !!s) && !(e = s === n) && (e = ot(
      n,
      s,
      at
    ), e === null ? e = !1 : (g(
      e,
      !0,
      Z,
      s,
      n
    ), s = Q, Q = null, e = s !== null)), e) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((e = !!s) && !(e = s === i) && (e = ot(
      i,
      s,
      at
    ), e === null ? e = !1 : (g(
      e,
      !0,
      q,
      s,
      i
    ), s = Q, Y = Q = null, e = s !== null)), e) : !1;
  }
  function Cg(t, e) {
    var n = t.ownerDocument.createRange();
    n.selectNodeContents(t), t = n.getBoundingClientRect(), window.scrollTo(
      window.scrollX + t.left,
      e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
    );
  }
  He.prototype.scrollIntoView = function(t) {
    if (typeof t == "object") throw Error(r(566));
    var e = [];
    g(
      this._fragmentFiber.child,
      !1,
      qc,
      e,
      void 0,
      void 0
    );
    var n = t !== !1;
    if (e.length === 0) {
      var i = R(
        this._fragmentFiber
      );
      if (i = n ? i[1] || i[0] || b(this._fragmentFiber) : i[0] || i[1], i === null) return;
      if (i.tag === 6) {
        t = V(i), Cg(t, n);
        return;
      }
      if (i = V(i), i.nodeType !== 9) {
        if (i.nodeType === 11) {
          n = "host" in i ? i.host : null, n !== null && n.scrollIntoView(t);
          return;
        }
        i.scrollIntoView(t);
      }
    }
    for (i = n ? e.length - 1 : 0; i !== (n ? -1 : e.length); ) {
      var u = e[i];
      u.tag === 6 ? (u = V(u), Cg(u, n)) : V(u).scrollIntoView(t), i += n ? -1 : 1;
    }
  };
  function FT(t, e) {
    return t = V(t), Og(t, e), !1;
  }
  function Og(t, e) {
    t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(e);
  }
  function zg(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var u = n[i];
        t.addEventListener(
          u.type,
          u.attachedListener,
          Ha(u.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(s) {
      for (var f = 0, y = 0; y < nn.length; y++) {
        var T = nn[y];
        (T.fragmentInstance !== e || T.observer !== s || T.instance !== t) && (nn[f++] = T);
      }
      nn.length = f, s.observe(t);
    }), Og(t, e));
  }
  function kT(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var u = n[i];
        t.removeEventListener(
          u.type,
          u.attachedListener,
          Ha(u.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(s) {
      typeof s.rootMargin == "string" ? KT(
        e,
        s,
        t
      ) : s.unobserve(t);
    }), t.reactFragments != null && t.reactFragments.delete(e));
  }
  function Qc(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (e = e.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Qc(n), Eu(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function WT(t, e, n, i) {
    for (; t.nodeType === 1; ) {
      var u = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!i && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (i) {
        if (!t[ll])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (s = t.getAttribute("rel"), s === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (s !== u.rel || t.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || t.getAttribute("title") !== (u.title == null ? null : u.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (s = t.getAttribute("src"), (s !== (u.src == null ? null : u.src) || t.getAttribute("type") !== (u.type == null ? null : u.type) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && s && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var s = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && t.getAttribute("name") === s)
          return t;
      } else return t;
      if (t = Je(t.nextSibling), t === null) break;
    }
    return null;
  }
  function IT(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = Je(t.nextSibling), t === null)) return null;
    return t;
  }
  function Rg(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = Je(t.nextSibling), t === null)) return null;
    return t;
  }
  function Zc(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Kc(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function $T(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading")
      e();
    else {
      var i = function() {
        e(), n.removeEventListener("DOMContentLoaded", i);
      };
      n.addEventListener("DOMContentLoaded", i), t._reactRetry = i;
    }
  }
  function Je(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var Jc = null;
  function _g(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0)
            return Je(t.nextSibling);
          e--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Ng(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (e === 0) return t;
          e--;
        } else n !== "/$" && n !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function tb(t, e) {
    function n() {
      i = !0;
    }
    if (t.ownerDocument.activeElement === t) return !0;
    var i = !1;
    try {
      t.ownerDocument.addEventListener("focus", n, !0), (t.focus || HTMLElement.prototype.focus).call(t, e);
    } finally {
      t.ownerDocument.removeEventListener("focus", n, !0);
    }
    return i;
  }
  function eb(t) {
    pg(function() {
      pg(function(e) {
        return t(e);
      });
    });
  }
  function Vg(t, e, n) {
    switch (e = Gl(n), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(r(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(r(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function Ug(t, e, n) {
    for (var i in n) {
      var u = n[i];
      n.hasOwnProperty(i) && u != null && Ct(t, e, i, null, RT, u);
    }
    n.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === cn && (t.onclick = null), Eu(t);
  }
  function Pc(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    Eu(t);
  }
  var Pe = /* @__PURE__ */ new Map(), wg = /* @__PURE__ */ new Set();
  function ql(t) {
    if (typeof t.getRootNode == "function") {
      var e = t.getRootNode();
      if (e.nodeType === 9 || e.nodeType === 11) return e;
    }
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  var qn = nt.d;
  nt.d = {
    f: nb,
    r: ib,
    D: ab,
    C: lb,
    L: ub,
    m: sb,
    X: rb,
    S: ob,
    M: cb
  };
  function nb() {
    var t = qn.f(), e = Ms();
    return t || e;
  }
  function ib(t) {
    var e = na(t);
    e !== null && e.tag === 5 && e.type === "form" ? Hm(e) : qn.r(t);
  }
  var La = typeof document > "u" ? null : document;
  function Bg(t, e, n) {
    var i = La;
    if (i && typeof e == "string" && e) {
      var u = Ye(e);
      u = 'link[rel="' + t + '"][href="' + u + '"]', typeof n == "string" && (u += '[crossorigin="' + n + '"]'), wg.has(u) || (wg.add(u), t = { rel: t, crossOrigin: n, href: e }, i.querySelector(u) === null && (e = i.createElement("link"), oe(e, "link", t), It(e), i.head.appendChild(e)));
    }
  }
  function ab(t) {
    qn.D(t), Bg("dns-prefetch", t, null);
  }
  function lb(t, e) {
    qn.C(t, e), Bg("preconnect", t, e);
  }
  function ub(t, e, n) {
    qn.L(t, e, n);
    var i = La;
    if (i && t && e) {
      var u = 'link[rel="preload"][as="' + Ye(e) + '"]';
      e === "image" && n && n.imageSrcSet ? (u += '[imagesrcset="' + Ye(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (u += '[imagesizes="' + Ye(
        n.imageSizes
      ) + '"]')) : u += '[href="' + Ye(t) + '"]';
      var s = u;
      switch (e) {
        case "style":
          s = ja(t);
          break;
        case "script":
          s = Ya(t);
      }
      if (!(Pe.has(s) || (t = w(
        {
          rel: "preload",
          href: e === "image" && n && n.imageSrcSet ? void 0 : t,
          as: e
        },
        n
      ), Pe.set(s, t), i.querySelector(u) !== null || e === "style" && i.querySelector(Xl(s)) || e === "script" && i.querySelector(Ql(s))))) {
        var f = i.createElement("link");
        oe(f, "link", t), e === "style" && (f[bu] = !0, f.onload = f.onerror = function() {
          Fh(f);
        }), It(f), i.head.appendChild(f);
      }
    }
  }
  function sb(t, e) {
    qn.m(t, e);
    var n = La;
    if (n && t) {
      var i = e && typeof e.as == "string" ? e.as : "script", u = 'link[rel="modulepreload"][as="' + Ye(i) + '"][href="' + Ye(t) + '"]', s = u;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = Ya(t);
      }
      if (!Pe.has(s) && (t = w({ rel: "modulepreload", href: t }, e), Pe.set(s, t), n.querySelector(u) === null)) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Ql(s)))
              return;
        }
        i = n.createElement("link"), oe(i, "link", t), It(i), n.head.appendChild(i);
      }
    }
  }
  function ob(t, e, n) {
    qn.S(t, e, n);
    var i = La;
    if (i && t) {
      var u = ia(i).hoistableStyles, s = ja(t);
      e = e || "default";
      var f = u.get(s);
      if (!f) {
        var y = { loading: 0, preload: null };
        if (f = i.querySelector(
          Xl(s)
        ))
          y.loading = 5;
        else {
          t = w(
            { rel: "stylesheet", href: t, "data-precedence": e },
            n
          ), (n = Pe.get(s)) && Fc(t, n);
          var T = f = i.createElement("link");
          It(T), oe(T, "link", t), T._p = new Promise(function(x, z) {
            T.onload = x, T.onerror = z;
          }), T.addEventListener("load", function() {
            y.loading |= 1;
          }), T.addEventListener("error", function() {
            y.loading |= 2;
          }), y.loading |= 4, Ns(f, e, i);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: y
        }, u.set(s, f);
      }
    }
  }
  function rb(t, e) {
    qn.X(t, e);
    var n = La;
    if (n && t) {
      var i = ia(n).hoistableScripts, u = Ya(t), s = i.get(u);
      s || (s = n.querySelector(Ql(u)), s || (t = w({ src: t, async: !0 }, e), (e = Pe.get(u)) && kc(t, e), s = n.createElement("script"), It(s), oe(s, "link", t), n.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, i.set(u, s));
    }
  }
  function cb(t, e) {
    qn.M(t, e);
    var n = La;
    if (n && t) {
      var i = ia(n).hoistableScripts, u = Ya(t), s = i.get(u);
      s || (s = n.querySelector(Ql(u)), s || (t = w({ src: t, async: !0, type: "module" }, e), (e = Pe.get(u)) && kc(t, e), s = n.createElement("script"), It(s), oe(s, "link", t), n.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, i.set(u, s));
    }
  }
  function Hg(t, e, n, i) {
    var u = (u = Zn.current) ? ql(u) : null;
    if (!u) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (n = ja(n.href), e = ia(
          u
        ).hoistableStyles, i = e.get(n), i || (i = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, i)), i) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = ja(n.href);
          var s = ia(
            u
          ).hoistableStyles, f = s.get(t);
          if (f || (u = u.ownerDocument || u, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, s.set(t, f), (s = u.querySelector(
            Xl(t)
          )) ? s._p || (f.instance = s, f.state.loading = 5) : (s = Pe.get(t), s || (s = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, Pe.set(t, s)), fb(
            u,
            t,
            s,
            f.state
          ))), e && i === null)
            throw Error(r(528, ""));
          return f;
        }
        if (e && i !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (n = Ya(n), e = ia(
          u
        ).hoistableScripts, i = e.get(n), i || (i = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, i)), i) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, t));
    }
  }
  function ja(t) {
    return 'href="' + Ye(t) + '"';
  }
  function Xl(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Lg(t) {
    return w({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function fb(t, e, n, i) {
    if (e = t.querySelector(
      'link[rel="preload"][as="style"][' + e + "]"
    )) {
      if (e[bu] !== !0) {
        i.loading = 1;
        return;
      }
    } else
      e = t.createElement("link"), e[bu] = !0, e.onload = e.onerror = Fh.bind(null, e), oe(e, "link", n), It(e), t.head.appendChild(e);
    i.preload = e, e.addEventListener("load", function() {
      return i.loading |= 1;
    }), e.addEventListener("error", function() {
      return i.loading |= 2;
    });
  }
  function Ya(t) {
    return '[src="' + Ye(t) + '"]';
  }
  function Ql(t) {
    return "script[async]" + t;
  }
  function jg(t, e, n) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var i = t.querySelector(
            'style[data-href~="' + Ye(n.href) + '"]'
          );
          if (i)
            return e.instance = i, It(i), i;
          var u = w({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return i = (t.ownerDocument || t).createElement(
            "style"
          ), It(i), oe(i, "style", u), Ns(i, n.precedence, t), e.instance = i;
        case "stylesheet":
          u = ja(n.href);
          var s = t.querySelector(
            Xl(u)
          );
          if (s)
            return e.state.loading |= 4, e.instance = s, It(s), s;
          i = Lg(n), (u = Pe.get(u)) && Fc(i, u), s = (t.ownerDocument || t).createElement("link"), It(s);
          var f = s;
          return f._p = new Promise(function(y, T) {
            f.onload = y, f.onerror = T;
          }), oe(s, "link", i), e.state.loading |= 4, Ns(s, n.precedence, t), e.instance = s;
        case "script":
          return s = Ya(n.src), (u = t.querySelector(
            Ql(s)
          )) ? (e.instance = u, It(u), u) : (i = n, (u = Pe.get(s)) && (i = w({}, n), kc(i, u)), t = t.ownerDocument || t, u = t.createElement("script"), It(u), oe(u, "link", i), t.head.appendChild(u), e.instance = u);
        case "void":
          return null;
        default:
          throw Error(r(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (i = e.instance, e.state.loading |= 4, Ns(i, n.precedence, t));
    return e.instance;
  }
  function Ns(t, e, n) {
    for (var i = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = i.length ? i[i.length - 1] : null, s = u, f = 0; f < i.length; f++) {
      var y = i[f];
      if (y.dataset.precedence === e) s = y;
      else if (s !== u) break;
    }
    s ? s.parentNode.insertBefore(t, s.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
  }
  function Fc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function kc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Vs = null;
  function Yg(t, e, n) {
    if (Vs === null) {
      var i = /* @__PURE__ */ new Map(), u = Vs = /* @__PURE__ */ new Map();
      u.set(n, i);
    } else
      u = Vs, i = u.get(n), i || (i = /* @__PURE__ */ new Map(), u.set(n, i));
    if (i.has(t)) return i;
    for (i.set(t, null), n = n.getElementsByTagName(t), u = 0; u < n.length; u++) {
      var s = n[u];
      if (!(s[ll] || s[ie] || t === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = s.getAttribute(e) || "";
        f = t + f;
        var y = i.get(f);
        y ? y.push(s) : i.set(f, [s]);
      }
    }
    return i;
  }
  function Wc(t, e, n) {
    t = t.ownerDocument || t, t.head.insertBefore(
      n,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function hb(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        return e.rel === "stylesheet" ? (t = e.disabled, typeof e.precedence == "string" && t == null) : !0;
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function Gg(t, e) {
    return t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy";
  }
  function qg(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function Xg(t) {
    return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Qg(t, e) {
    typeof e.decode == "function" && (t.imgCount++, e.complete || (t.imgBytes += Xg(e), t.suspenseyImages.push(e)), t = yb.bind(t), e.decode().then(t, t));
  }
  function db(t, e, n, i) {
    if (n.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var u = ja(i.href), s = e.querySelector(
          Xl(u)
        );
        if (s) {
          e = s._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = Zl.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = s, It(s);
          return;
        }
        s = e.ownerDocument || e, i = Lg(i), (u = Pe.get(u)) && Fc(i, u), s = s.createElement("link"), It(s);
        var f = s;
        f._p = new Promise(function(y, T) {
          f.onload = y, f.onerror = T;
        }), oe(s, "link", i), n.instance = s;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = Zl.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
    }
  }
  var Us = 0;
  function mb(t, e) {
    return t.stylesheets && t.count === 0 && Bs(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
      var i = setTimeout(function() {
        if (t.stylesheets && Bs(t, t.stylesheets), t.unsuspend) {
          var s = t.unsuspend;
          t.unsuspend = null, s();
        }
      }, 6e4 + e);
      0 < t.imgBytes && Us === 0 && (Us = 62500 * NT());
      var u = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && Bs(t, t.stylesheets), t.unsuspend)) {
            var s = t.unsuspend;
            t.unsuspend = null, s();
          }
        },
        (t.imgBytes > Us ? 50 : 800) + e
      );
      return t.unsuspend = n, function() {
        t.unsuspend = null, clearTimeout(i), clearTimeout(u);
      };
    } : null;
  }
  function Zg(t) {
    if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
      if (t.stylesheets) Bs(t, t.stylesheets);
      else if (t.unsuspend) {
        var e = t.unsuspend;
        t.unsuspend = null, e();
      }
    }
  }
  function Zl() {
    this.count--, Zg(this);
  }
  function yb() {
    this.imgCount--, Zg(this);
  }
  var ws = null;
  function Bs(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, ws = /* @__PURE__ */ new Map(), e.forEach(gb, t), ws = null, Zl.call(t));
  }
  function gb(t, e) {
    if (!(e.state.loading & 4)) {
      var n = ws.get(t);
      if (n) var i = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), ws.set(t, n);
        for (var u = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), s = 0; s < u.length; s++) {
          var f = u[s];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (n.set(f.dataset.precedence, f), i = f);
        }
        i && n.set(null, i);
      }
      u = e.instance, f = u.getAttribute("data-precedence"), s = n.get(f) || i, s === i && n.set(null, u), n.set(f, u), this.count++, i = Zl.bind(this), u.addEventListener("load", i), u.addEventListener("error", i), s ? s.parentNode.insertBefore(u, s.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(u, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Ga = {
    $$typeof: wt,
    Provider: null,
    Consumer: null,
    _currentValue: Cn,
    _currentValue2: Cn,
    _threadCount: 0
  };
  function vb(t, e, n, i, u, s, f, y, T) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = _o(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = _o(0), this.hiddenUpdates = _o(null), this.identifierPrefix = i, this.onUncaughtError = u, this.onCaughtError = s, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = T, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Kg(t, e, n, i, u, s, f, y, T, x, z, U) {
    return t = new vb(
      t,
      e,
      n,
      f,
      T,
      x,
      z,
      U,
      y
    ), e = 1, s === !0 && (e |= 24), s = Ee(3, null, null, e), t.current = s, s.stateNode = t, e = hr(), e.refCount++, t.pooledCache = e, e.refCount++, s.memoizedState = {
      element: i,
      isDehydrated: n,
      cache: e
    }, gr(s), t;
  }
  function Jg(t) {
    return t ? (t = da, t) : da;
  }
  function Pg(t, e, n, i, u, s) {
    u = Jg(u), i.context === null ? i.context = u : i.pendingContext = u, i = ni(e), i.payload = { element: n }, s = s === void 0 ? null : s, s !== null && (i.callback = s), n = ii(t, i, e), n !== null && (xe(n, t, e), El(n, t, e));
  }
  function Fg(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function Ic(t, e) {
    Fg(t, e), (t = t.alternate) && Fg(t, e);
  }
  function kg(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Oi(t, 67108864);
      e !== null && xe(e, t, 67108864), Ic(t, 67108864);
    }
  }
  function Wg(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Be();
      e = No(e);
      var n = Oi(t, e);
      n !== null && xe(n, t, e), Ic(t, e);
    }
  }
  var qa = !0;
  function pb(t, e, n, i) {
    var u = F.T;
    F.T = null;
    var s = nt.p;
    try {
      nt.p = 2, $c(t, e, n, i);
    } finally {
      nt.p = s, F.T = u;
    }
  }
  function Sb(t, e, n, i) {
    var u = F.T;
    F.T = null;
    var s = nt.p;
    try {
      nt.p = 8, $c(t, e, n, i);
    } finally {
      nt.p = s, F.T = u;
    }
  }
  function $c(t, e, n, i) {
    if (qa) {
      var u = tf(i);
      if (u === null)
        Uc(
          t,
          e,
          i,
          Hs,
          n
        ), $g(t, i);
      else if (bb(
        u,
        t,
        e,
        n,
        i
      ))
        i.stopPropagation();
      else if ($g(t, i), e & 4 && -1 < Tb.indexOf(t)) {
        for (; u !== null; ) {
          var s = na(u);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (s = s.stateNode, s.current.memoizedState.isDehydrated) {
                  var f = Ai(s.pendingLanes);
                  if (f !== 0) {
                    var y = s;
                    for (y.pendingLanes |= 2, y.entangledLanes |= 2; f; ) {
                      var T = 1 << 31 - ze(f);
                      y.entanglements[1] |= T, f &= ~T;
                    }
                    Tn(s), (At & 6) === 0 && (Es = Ce() + 500, Ll(0));
                  }
                }
                break;
              case 31:
              case 13:
                y = Oi(s, 2), y !== null && xe(y, s, 2), Ms(), Ic(s, 2);
            }
          if (s = tf(i), s === null && Uc(
            t,
            e,
            i,
            Hs,
            n
          ), s === u) break;
          u = s;
        }
        u !== null && i.stopPropagation();
      } else
        Uc(
          t,
          e,
          i,
          null,
          n
        );
    }
  }
  function tf(t) {
    return t = jo(t), ef(t);
  }
  var Hs = null;
  function ef(t) {
    if (Hs = null, t = Di(t), t !== null) {
      var e = d(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (t = h(e), t !== null) return t;
          t = null;
        } else if (n === 31) {
          if (t = m(e), t !== null) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return Hs = t, null;
  }
  function Ig(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (N1()) {
          case Hh:
            return 2;
          case Lh:
            return 8;
          case gu:
          case V1:
            return 32;
          case jh:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var nf = !1, yi = null, gi = null, vi = null, Kl = /* @__PURE__ */ new Map(), Jl = /* @__PURE__ */ new Map(), pi = [], Tb = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function $g(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        yi = null;
        break;
      case "dragenter":
      case "dragleave":
        gi = null;
        break;
      case "mouseover":
      case "mouseout":
        vi = null;
        break;
      case "pointerover":
      case "pointerout":
        Kl.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Jl.delete(e.pointerId);
    }
  }
  function Pl(t, e, n, i, u, s) {
    return t === null || t.nativeEvent !== s ? (t = {
      blockedOn: e,
      domEventName: n,
      eventSystemFlags: i,
      nativeEvent: s,
      targetContainers: [u]
    }, e !== null && (e = na(e), e !== null && kg(e)), t) : (t.eventSystemFlags |= i, e = t.targetContainers, u !== null && e.indexOf(u) === -1 && e.push(u), t);
  }
  function bb(t, e, n, i, u) {
    switch (e) {
      case "focusin":
        return yi = Pl(
          yi,
          t,
          e,
          n,
          i,
          u
        ), !0;
      case "dragenter":
        return gi = Pl(
          gi,
          t,
          e,
          n,
          i,
          u
        ), !0;
      case "mouseover":
        return vi = Pl(
          vi,
          t,
          e,
          n,
          i,
          u
        ), !0;
      case "pointerover":
        var s = u.pointerId;
        return Kl.set(
          s,
          Pl(
            Kl.get(s) || null,
            t,
            e,
            n,
            i,
            u
          )
        ), !0;
      case "gotpointercapture":
        return s = u.pointerId, Jl.set(
          s,
          Pl(
            Jl.get(s) || null,
            t,
            e,
            n,
            i,
            u
          )
        ), !0;
    }
    return !1;
  }
  function t0(t) {
    var e = Di(t.target);
    if (e !== null) {
      var n = d(e);
      if (n !== null) {
        if (e = n.tag, e === 13) {
          if (e = h(n), e !== null) {
            t.blockedOn = e, Kh(t.priority, function() {
              Wg(n);
            });
            return;
          }
        } else if (e === 31) {
          if (e = m(n), e !== null) {
            t.blockedOn = e, Kh(t.priority, function() {
              Wg(n);
            });
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Ls(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = tf(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var i = new n.constructor(
          n.type,
          n
        );
        Lo = i, n.target.dispatchEvent(i), Lo = null;
      } else
        return e = na(n), e !== null && kg(e), t.blockedOn = n, !1;
      e.shift();
    }
    return !0;
  }
  function e0(t, e, n) {
    Ls(t) && n.delete(e);
  }
  function Eb() {
    nf = !1, yi !== null && Ls(yi) && (yi = null), gi !== null && Ls(gi) && (gi = null), vi !== null && Ls(vi) && (vi = null), Kl.forEach(e0), Jl.forEach(e0);
  }
  function js(t, e) {
    t.blockedOn === e && (t.blockedOn = null, nf || (nf = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      Eb
    )));
  }
  var Ys = null;
  function n0(t) {
    Ys !== t && (Ys = t, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        Ys === t && (Ys = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e], i = t[e + 1], u = t[e + 2];
          if (typeof i != "function") {
            if (ef(i || n) === null)
              continue;
            break;
          }
          var s = na(n);
          s !== null && (t.splice(e, 3), e -= 3, Hr(
            s,
            {
              pending: !0,
              data: u,
              method: n.method,
              action: i
            },
            i,
            u
          ));
        }
      }
    ));
  }
  function Xa(t) {
    function e(T) {
      return js(T, t);
    }
    yi !== null && js(yi, t), gi !== null && js(gi, t), vi !== null && js(vi, t), Kl.forEach(e), Jl.forEach(e);
    for (var n = 0; n < pi.length; n++) {
      var i = pi[n];
      i.blockedOn === t && (i.blockedOn = null);
    }
    for (; 0 < pi.length && (n = pi[0], n.blockedOn === null); )
      t0(n), n.blockedOn === null && pi.shift();
    if (n = (t.ownerDocument || t).$$reactFormReplay, n != null)
      for (i = 0; i < n.length; i += 3) {
        var u = n[i], s = n[i + 1], f = u[be] || null;
        if (typeof s == "function")
          f || n0(n);
        else if (f) {
          var y = null;
          if (s && s.hasAttribute("formAction")) {
            if (u = s, f = s[be] || null)
              y = f.formAction;
            else if (ef(u) !== null) continue;
          } else y = f.action;
          typeof y == "function" ? n[i + 1] = y : (n.splice(i, 3), i -= 3), n0(n);
        }
      }
  }
  function i0() {
    function t(s) {
      s.canIntercept && s.info === "react-transition" && s.intercept({
        handler: function() {
          return new Promise(function(f) {
            return u = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      u !== null && (u(), u = null), i || setTimeout(n, 20);
    }
    function n() {
      if (!i && !navigation.transition) {
        var s = navigation.currentEntry;
        s && s.url != null && navigation.navigate(s.url, {
          state: s.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var i = !1, u = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
        i = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), u !== null && (u(), u = null);
      };
    }
  }
  function af(t) {
    this._internalRoot = t;
  }
  Gs.prototype.render = af.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(r(409));
    var n = e.current, i = Be();
    Pg(n, i, t, e, null, null);
  }, Gs.prototype.unmount = af.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      Pg(t.current, 2, null, t, null, null), Ms(), e[ea] = null;
    }
  };
  function Gs(t) {
    this._internalRoot = t;
  }
  Gs.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = Zh();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < pi.length && e !== 0 && e < pi[n].priority; n++) ;
      pi.splice(n, 0, t), n === 0 && t0(t);
    }
  };
  var a0 = l.version;
  if (a0 !== "19.3.0")
    throw Error(
      r(
        527,
        a0,
        "19.3.0"
      )
    );
  nt.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
    return t = p(e), t = t !== null ? v(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Ab = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: F,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var qs = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!qs.isDisabled && qs.supportsFiber)
      try {
        nl = qs.inject(
          Ab
        ), Oe = qs;
      } catch {
      }
  }
  return kl.createRoot = function(t, e) {
    if (!c(t)) throw Error(r(299));
    var n = !1, i = "", u = Jm, s = Pm, f = Fm;
    return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (i = e.identifierPrefix), e.onUncaughtError !== void 0 && (u = e.onUncaughtError), e.onCaughtError !== void 0 && (s = e.onCaughtError), e.onRecoverableError !== void 0 && (f = e.onRecoverableError)), e = Kg(
      t,
      1,
      !1,
      null,
      null,
      n,
      i,
      null,
      u,
      s,
      f,
      i0
    ), t[ea] = e.current, Vc(t), new af(e);
  }, kl.hydrateRoot = function(t, e, n) {
    if (!c(t)) throw Error(r(299));
    var i = !1, u = "", s = Jm, f = Pm, y = Fm, T = null;
    return n != null && (n.unstable_strictMode === !0 && (i = !0), n.identifierPrefix !== void 0 && (u = n.identifierPrefix), n.onUncaughtError !== void 0 && (s = n.onUncaughtError), n.onCaughtError !== void 0 && (f = n.onCaughtError), n.onRecoverableError !== void 0 && (y = n.onRecoverableError), n.formState !== void 0 && (T = n.formState)), e = Kg(
      t,
      1,
      !0,
      e,
      n ?? null,
      i,
      u,
      T,
      s,
      f,
      y,
      i0
    ), e.context = Jg(null), n = e.current, i = Be(), i = No(i), u = ni(i), u.callback = null, ii(n, u, i), n = i, e.current.lanes = n, al(e, n), Tn(e), t[ea] = e.current, Vc(t), new Gs(e);
  }, kl.version = "19.3.0", kl;
}
var m0;
function Vb() {
  if (m0) return uf.exports;
  m0 = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return a(), uf.exports = Nb(), uf.exports;
}
var Ub = Vb(), I = $f();
const Yv = I.createContext({});
function Wa(a) {
  const l = I.useRef(null);
  return l.current === null && (l.current = a()), l.current;
}
const wb = typeof window < "u", ao = wb ? I.useLayoutEffect : I.useEffect, th = /* @__PURE__ */ I.createContext(null);
function eh(a, l) {
  a.indexOf(l) === -1 && a.push(l);
}
function lo(a, l) {
  const o = a.indexOf(l);
  o > -1 && a.splice(o, 1);
}
const Mn = (a, l, o) => o > l ? l : o < a ? a : o;
let vo = () => {
};
const Qn = {}, nh = (a) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(a), Gv = (a) => typeof a == "object" && a !== null, ih = (a) => /^0[^.\s]+$/u.test(a);
// @__NO_SIDE_EFFECTS__
function qv(a) {
  let l;
  return () => (l === void 0 && (l = a()), l);
}
const Le = /* @__NO_SIDE_EFFECTS__ */ (a) => a, cu = (...a) => a.reduce((l, o) => (r) => o(l(r))), Ii = /* @__NO_SIDE_EFFECTS__ */ (a, l, o) => {
  const r = l - a;
  return r ? (o - a) / r : 1;
};
class uo {
  constructor() {
    this.subscriptions = [];
  }
  add(l) {
    return eh(this.subscriptions, l), () => this.remove(l);
  }
  remove(l) {
    lo(this.subscriptions, l);
  }
  notify(l, o, r) {
    const c = this.subscriptions.length;
    if (c)
      if (c === 1)
        this.subscriptions[0](l, o, r);
      else
        for (let d = 0; d < c; d++) {
          const h = this.subscriptions[d];
          h && h(l, o, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const ke = /* @__NO_SIDE_EFFECTS__ */ (a) => a * 1e3, Fe = /* @__NO_SIDE_EFFECTS__ */ (a) => a / 1e3, ah = /* @__NO_SIDE_EFFECTS__ */ (a, l) => l ? a * (1e3 / l) : 0, Xv = (a, l, o) => (((1 - 3 * o + 3 * l) * a + (3 * o - 6 * l)) * a + 3 * l) * a, Bb = 1e-7, Hb = 12;
function Lb(a, l, o, r, c) {
  let d, h, m = 0;
  do
    h = l + (o - l) / 2, d = Xv(h, r, c) - a, d > 0 ? o = h : l = h;
  while (Math.abs(d) > Bb && ++m < Hb);
  return h;
}
// @__NO_SIDE_EFFECTS__
function fu(a, l, o, r) {
  if (a === l && o === r)
    return Le;
  const c = (d) => Lb(d, 0, 1, a, o);
  return (d) => d === 0 || d === 1 ? d : Xv(c(d), l, r);
}
const Qv = /* @__NO_SIDE_EFFECTS__ */ (a) => (l) => l <= 0.5 ? a(2 * l) / 2 : (2 - a(2 * (1 - l))) / 2, Zv = /* @__NO_SIDE_EFFECTS__ */ (a) => (l) => 1 - a(1 - l), Kv = /* @__PURE__ */ fu(0.33, 1.53, 0.69, 0.99), lh = /* @__PURE__ */ Zv(Kv), Jv = /* @__PURE__ */ Qv(lh), Pv = (a) => a >= 1 ? 1 : (a *= 2) < 1 ? 0.5 * lh(a) : 0.5 * (2 - Math.pow(2, -10 * (a - 1))), uh = (a) => 1 - Math.sin(Math.acos(a)), Fv = /* @__PURE__ */ Zv(uh), kv = /* @__PURE__ */ Qv(uh), jb = /* @__PURE__ */ fu(0.42, 0, 1, 1), Yb = /* @__PURE__ */ fu(0, 0, 0.58, 1), sh = /* @__PURE__ */ fu(0.42, 0, 0.58, 1), Gb = /* @__NO_SIDE_EFFECTS__ */ (a) => Array.isArray(a) && typeof a[0] != "number", Wv = /* @__NO_SIDE_EFFECTS__ */ (a) => Array.isArray(a) && typeof a[0] == "number", qb = {
  linear: Le,
  easeIn: jb,
  easeInOut: sh,
  easeOut: Yb,
  circIn: uh,
  circInOut: kv,
  circOut: Fv,
  backIn: lh,
  backInOut: Jv,
  backOut: Kv,
  anticipate: Pv
}, Xb = (a) => typeof a == "string", y0 = (a) => {
  if (/* @__PURE__ */ Wv(a)) {
    vo(a.length === 4);
    const [l, o, r, c] = a;
    return /* @__PURE__ */ fu(l, o, r, c);
  } else if (Xb(a))
    return qb[a];
  return a;
}, Pt = {
  delta: 0,
  timestamp: 0,
  isProcessing: !1
};
let Fs;
function Qb() {
  Fs = void 0;
}
const fe = {
  now: () => (Fs === void 0 && fe.set(Pt.isProcessing || Qn.useManualTiming ? Pt.timestamp : performance.now()), Fs),
  set: (a) => {
    Fs = a, queueMicrotask(Qb);
  }
}, ka = (a) => Math.round(a * 1e5) / 1e5, Iv = (a) => (l) => typeof l == "string" && l.startsWith(a), $v = /* @__PURE__ */ Iv("--"), Zb = /* @__PURE__ */ Iv("var(--"), oh = (a) => Zb(a) ? Kb.test(a.split("/*")[0].trim()) : !1, Kb = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function g0(a) {
  return typeof a != "string" ? !1 : a.split("/*")[0].includes("var(--");
}
const $a = {
  test: (a) => typeof a == "number",
  parse: parseFloat,
  transform: (a) => a
}, iu = {
  ...$a,
  transform: (a) => Mn(0, 1, a)
}, Xs = {
  ...$a,
  default: 1
}, rh = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Jb(a) {
  return a == null;
}
const Pb = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, ch = (a, l) => (o) => !!(typeof o == "string" && Pb.test(o) && o.startsWith(a) || l && !Jb(o) && Object.prototype.hasOwnProperty.call(o, l)), tp = (a, l, o) => (r) => {
  if (typeof r != "string")
    return r;
  const [c, d, h, m] = r.match(rh);
  return {
    [a]: parseFloat(c),
    [l]: parseFloat(d),
    [o]: parseFloat(h),
    alpha: m !== void 0 ? parseFloat(m) : 1
  };
}, Fb = (a) => Mn(0, 255, a), ff = {
  ...$a,
  transform: (a) => Math.round(Fb(a))
}, Ji = {
  test: /* @__PURE__ */ ch("rgb", "red"),
  parse: /* @__PURE__ */ tp("red", "green", "blue"),
  transform: ({ red: a, green: l, blue: o, alpha: r = 1 }) => "rgba(" + ff.transform(a) + ", " + ff.transform(l) + ", " + ff.transform(o) + ", " + ka(iu.transform(r)) + ")"
};
function kb(a) {
  let l = "", o = "", r = "", c = "";
  return a.length > 5 ? (l = a.substring(1, 3), o = a.substring(3, 5), r = a.substring(5, 7), c = a.substring(7, 9)) : (l = a.substring(1, 2), o = a.substring(2, 3), r = a.substring(3, 4), c = a.substring(4, 5), l += l, o += o, r += r, c += c), {
    red: parseInt(l, 16),
    green: parseInt(o, 16),
    blue: parseInt(r, 16),
    alpha: c ? parseInt(c, 16) / 255 : 1
  };
}
const zf = {
  test: /* @__PURE__ */ ch("#"),
  parse: kb,
  transform: Ji.transform
}, hu = /* @__NO_SIDE_EFFECTS__ */ (a) => ({
  test: (l) => typeof l == "string" && l.endsWith(a) && l.split(" ").length === 1,
  parse: parseFloat,
  transform: (l) => `${l}${a}`
}), Xn = /* @__PURE__ */ hu("deg"), Dn = /* @__PURE__ */ hu("%"), P = /* @__PURE__ */ hu("px"), Wb = /* @__PURE__ */ hu("vh"), Ib = /* @__PURE__ */ hu("vw"), v0 = {
  ...Dn,
  parse: (a) => Dn.parse(a) / 100,
  transform: (a) => Dn.transform(a * 100)
}, Ka = {
  test: /* @__PURE__ */ ch("hsl", "hue"),
  parse: /* @__PURE__ */ tp("hue", "saturation", "lightness"),
  transform: ({ hue: a, saturation: l, lightness: o, alpha: r = 1 }) => "hsla(" + Math.round(a) + ", " + Dn.transform(ka(l)) + ", " + Dn.transform(ka(o)) + ", " + ka(iu.transform(r)) + ")"
}, Wt = {
  test: (a) => Ji.test(a) || zf.test(a) || Ka.test(a),
  parse: (a) => Ji.test(a) ? Ji.parse(a) : Ka.test(a) ? Ka.parse(a) : zf.parse(a),
  transform: (a) => typeof a == "string" ? a : a.hasOwnProperty("red") ? Ji.transform(a) : Ka.transform(a),
  getAnimatableNone: (a) => {
    const l = Wt.parse(a);
    return l.alpha = 0, Wt.transform(l);
  }
}, $b = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, ep = /* @__PURE__ */ new RegExp(rh.source), np = /* @__PURE__ */ new RegExp($b.source, "i");
function tE(a) {
  return isNaN(a) && typeof a == "string" && (ep.test(a) || np.test(a));
}
const ip = "number", ap = "color", eE = "var", nE = "var(", p0 = "${}", iE = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function aE(a) {
  const l = a.toString();
  return ep.test(l) || np.test(l);
}
function au(a) {
  const l = a.toString(), o = [], r = {
    color: [],
    number: [],
    var: []
  }, c = [];
  let d = 0;
  const m = l.replace(iE, (S) => (Wt.test(S) ? (r.color.push(d), c.push(ap), o.push(Wt.parse(S))) : S.startsWith(nE) ? (r.var.push(d), c.push(eE), o.push(S)) : (r.number.push(d), c.push(ip), o.push(parseFloat(S))), ++d, p0)).split(p0);
  return { values: o, split: m, indexes: r, types: c };
}
function lE(a) {
  return au(a).values;
}
function lp({ split: a, types: l }) {
  const o = a.length;
  return (r) => {
    let c = "";
    for (let d = 0; d < o; d++)
      if (c += a[d], r[d] !== void 0) {
        const h = l[d];
        h === ip ? c += ka(r[d]) : h === ap ? c += Wt.transform(r[d]) : c += r[d];
      }
    return c;
  };
}
function uE(a) {
  return lp(au(a));
}
const sE = (a) => typeof a == "number" ? 0 : Wt.test(a) ? Wt.getAnimatableNone(a) : a, oE = (a, l) => typeof a == "number" ? l?.trim().endsWith("/") ? a : 0 : sE(a);
function rE(a) {
  const l = au(a);
  return lp(l)(l.values.map((r, c) => oE(r, l.split[c])));
}
const je = {
  test: tE,
  parse: lE,
  createTransformer: uE,
  getAnimatableNone: rE
};
function hf(a, l, o) {
  return o < 0 && (o += 1), o > 1 && (o -= 1), o < 1 / 6 ? a + (l - a) * 6 * o : o < 1 / 2 ? l : o < 2 / 3 ? a + (l - a) * (2 / 3 - o) * 6 : a;
}
function cE({ hue: a, saturation: l, lightness: o, alpha: r }) {
  a /= 360, l /= 100, o /= 100;
  let c = 0, d = 0, h = 0;
  if (!l)
    c = d = h = o;
  else {
    const m = o < 0.5 ? o * (1 + l) : o + l - o * l, S = 2 * o - m;
    c = hf(S, m, a + 1 / 3), d = hf(S, m, a), h = hf(S, m, a - 1 / 3);
  }
  return {
    red: Math.round(c * 255),
    green: Math.round(d * 255),
    blue: Math.round(h * 255),
    alpha: r
  };
}
function so(a, l) {
  return (o) => o > 0 ? l : a;
}
const zt = (a, l, o) => a + (l - a) * o, df = (a, l, o) => {
  const r = a * a, c = o * (l * l - r) + r;
  return c < 0 ? 0 : Math.sqrt(c);
}, fE = [zf, Ji, Ka], hE = (a) => fE.find((l) => l.test(a));
function S0(a) {
  const l = hE(a);
  if (!l)
    return !1;
  let o = l.parse(a);
  return l === Ka && (o = cE(o)), o;
}
const T0 = (a, l) => {
  const o = S0(a), r = S0(l);
  if (!o || !r)
    return so(a, l);
  const c = { ...o };
  return (d) => (c.red = df(o.red, r.red, d), c.green = df(o.green, r.green, d), c.blue = df(o.blue, r.blue, d), c.alpha = zt(o.alpha, r.alpha, d), Ji.transform(c));
}, Rf = /* @__PURE__ */ new Set(["none", "hidden"]);
function dE(a, l) {
  return Rf.has(a) ? (o) => o <= 0 ? a : l : (o) => o >= 1 ? l : a;
}
function mE(a, l) {
  return (o) => zt(a, l, o);
}
function fh(a) {
  return typeof a == "number" ? mE : typeof a == "string" ? oh(a) ? so : Wt.test(a) ? T0 : vE : Array.isArray(a) ? up : typeof a == "object" ? Wt.test(a) ? T0 : yE : so;
}
function up(a, l) {
  const o = [...a], r = o.length, c = a.map((d, h) => fh(d)(d, l[h]));
  return (d) => {
    for (let h = 0; h < r; h++)
      o[h] = c[h](d);
    return o;
  };
}
function yE(a, l) {
  const o = { ...a, ...l }, r = {};
  for (const c in o)
    a[c] !== void 0 && l[c] !== void 0 && (r[c] = fh(a[c])(a[c], l[c]));
  return (c) => {
    for (const d in r)
      o[d] = r[d](c);
    return o;
  };
}
function gE(a, l) {
  const o = [], r = { color: 0, var: 0, number: 0 };
  for (let c = 0; c < l.values.length; c++) {
    const d = l.types[c], h = a.indexes[d][r[d]], m = a.values[h] ?? 0;
    o[c] = m, r[d]++;
  }
  return o;
}
const vE = (a, l) => {
  const o = je.createTransformer(l), r = au(a), c = au(l);
  return r.indexes.var.length === c.indexes.var.length && r.indexes.color.length === c.indexes.color.length && r.indexes.number.length >= c.indexes.number.length ? Rf.has(a) && !c.values.length || Rf.has(l) && !r.values.length ? dE(a, l) : cu(up(gE(r, c), c.values), o) : so(a, l);
}, b0 = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
function pE(a, l) {
  const o = b0.exec(a);
  if (!o)
    return;
  const r = b0.exec(l);
  if (!r || o[2] !== r[2])
    return;
  const c = o[2], d = parseFloat(o[1]), h = parseFloat(r[1]);
  return (m) => ka(zt(d, h, m)) + c;
}
function hh(a, l, o) {
  if (typeof a == "number" && typeof l == "number" && typeof o == "number")
    return zt(a, l, o);
  if (typeof a == "string" && typeof l == "string") {
    const c = pE(a, l);
    if (c)
      return c;
  }
  return fh(a)(a, l);
}
const Qs = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function SE(a) {
  let l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), r = !1, c = !1;
  const d = /* @__PURE__ */ new Set();
  let h = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function m(p) {
    d.has(p) && (o.add(p), a()), p(h);
  }
  const S = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (p, v = !1, g = !1) => {
      const _ = g && r ? l : o;
      return v && d.add(p), _.add(p), p;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (p) => {
      o.delete(p), d.delete(p);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (p) => {
      if (h = p, r) {
        c = !0;
        return;
      }
      r = !0;
      const v = l;
      l = o, o = v, l.forEach(m), l.clear(), r = !1, c && (c = !1, S.process(p));
    }
  };
  return S;
}
const TE = 40;
function sp(a, l, o = {
  delta: 0,
  timestamp: 0,
  isProcessing: !1
}) {
  let r = !1, c = !0;
  const d = () => r = !0, h = Qs.reduce((Z, q) => (Z[q] = SE(d), Z), {}), { setup: m, read: S, resolveKeyframes: p, preUpdate: v, update: g, preRender: b, render: _, postRender: R } = h, B = () => {
    const Z = Qn.useManualTiming, q = Z ? o.timestamp : performance.now();
    r = !1, Z || (o.delta = c ? 1e3 / 60 : Math.max(Math.min(q - o.timestamp, TE), 1)), o.timestamp = q, o.isProcessing = !0, m.process(o), S.process(o), p.process(o), v.process(o), g.process(o), b.process(o), _.process(o), R.process(o), o.isProcessing = !1, r && l && (c = !1, a(B));
  }, V = () => {
    r = !0, c = !0, o.isProcessing || a(B);
  };
  return { schedule: Qs.reduce((Z, q) => {
    const at = h[q];
    return Z[q] = (ot, w = !1, L = !1) => (r || V(), at.schedule(ot, w, L)), Z;
  }, {}), cancel: (Z) => {
    for (let q = 0; q < Qs.length; q++)
      h[Qs[q]].cancel(Z);
  }, state: o, steps: h };
}
const { schedule: bt, cancel: sn, steps: mf } = /* @__PURE__ */ sp(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Le, !0, Pt), bE = (a) => {
  const l = ({ timestamp: o }) => a(o);
  return {
    start: (o = !0) => bt.update(l, o),
    stop: () => sn(l),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => Pt.isProcessing ? Pt.timestamp : fe.now()
  };
}, op = (a, l, o = 10) => {
  let r = "";
  const c = Math.max(Math.round(l / o), 2);
  for (let d = 0; d < c; d++)
    r += Math.round(a(d / (c - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${r.substring(0, r.length - 2)})`;
}, dh = 2e4;
function mh(a, l = 50, o = dh, r) {
  let c = 0, d = a.next(c);
  for (; !d.done && c < o; )
    c += l, d = a.next(c);
  return c >= o ? 1 / 0 : c;
}
function EE(a, l = 100, o) {
  const r = o({ ...a, keyframes: [0, l] }), c = Math.min(mh(r), dh);
  return {
    type: "keyframes",
    ease: (d) => r.next(c * d).value / l,
    duration: /* @__PURE__ */ Fe(c)
  };
}
const ce = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05
}, rp = (a) => a < 0 ? 1 / Math.max(1 + a, ce.minDamping) : Math.max(1 - a, ce.minDamping);
function cp(a, l) {
  if (!(a > 1))
    return 1;
  const o = Math.sqrt(a * a - 1), r = a - o, c = a + o, d = 2 * o * Math.exp(-l) * (1 + l);
  return fp((h) => c * Math.exp(-r * h) - r * Math.exp(-c * h) - d, (h) => Math.exp(-c * h) - Math.exp(-r * h), l) / l;
}
function _f(a, l) {
  return a * Math.sqrt(1 - l * l);
}
const AE = 12;
function fp(a, l, o) {
  let r = o;
  for (let c = 1; c < AE; c++)
    r = r - a(r) / l(r);
  return r;
}
const yf = 1e-3;
function DE({ duration: a = ce.duration, bounce: l = ce.bounce }) {
  let o, r;
  const c = rp(l);
  a = Mn(ce.minDuration, ce.maxDuration, /* @__PURE__ */ Fe(a)), c < 1 ? (o = (p) => {
    const v = p * c, g = v * a, b = _f(p, c), _ = Math.exp(-g);
    return yf - v / b * _;
  }, r = (p) => {
    const g = p * c * a, b = c * c * p * p * a, _ = Math.exp(-g), R = _f(p * p, c);
    return (-o(p) + yf > 0 ? -1 : 1) * -b * _ / R;
  }) : (o = (p) => {
    const v = Math.exp(-p * a), g = p * a + 1;
    return -yf + v * g;
  }, r = (p) => {
    const v = Math.exp(-p * a), g = -p * (a * a);
    return v * g;
  });
  const d = 5 / a, h = fp(o, r, d), m = h * cp(c, h * a), S = m * m;
  return {
    stiffness: S,
    damping: c * 2 * Math.sqrt(S),
    duration: /* @__PURE__ */ ke(a)
  };
}
const Nf = (a, l) => (l ? a >= 0 : a > 0) && a < 1 / 0;
function gf(a, l) {
  if (Nf(a, l))
    return a;
}
function ME(a) {
  const l = gf(a.stiffness), o = gf(a.damping, !0), r = gf(a.mass), c = {
    ...a,
    stiffness: l ?? ce.stiffness,
    damping: o ?? ce.damping,
    mass: r ?? ce.mass,
    isResolvedFromDuration: !1,
    // stiffness/damping/mass overrides duration/bounce
    isTimeDefined: (l ?? o ?? r) === void 0 && (a.duration !== void 0 || a.bounce !== void 0)
  };
  if (c.isTimeDefined) {
    if (a.visualDuration) {
      const d = rp(a.bounce || 0), h = 2 * Math.PI / (a.visualDuration * 1.2) * cp(d, 2 * Math.PI / 1.2);
      c.stiffness = h * h, c.damping = 2 * d * Math.sqrt(c.stiffness);
    } else
      Object.assign(c, DE(c)), c.isResolvedFromDuration = !0;
    (!Nf(c.stiffness) || !Nf(c.damping, !0)) && (c.stiffness = ce.stiffness, c.damping = ce.damping);
  }
  return c;
}
function oo(a = ce.visualDuration, l = ce.bounce) {
  const o = typeof a != "object" ? {
    visualDuration: a,
    keyframes: [0, 1],
    bounce: l
  } : a, r = o.keyframes[0], c = o.keyframes[o.keyframes.length - 1], d = { done: !1, value: r }, { stiffness: h, damping: m, mass: S, duration: p, isResolvedFromDuration: v, isTimeDefined: g } = ME({ ...o }), b = (w) => g ? 0 : -/* @__PURE__ */ Fe(w), _ = m / (2 * Math.sqrt(h * S)), R = /* @__PURE__ */ Fe(Math.sqrt(h / S)), B = _ * R, V = {
    target: c,
    delta: c - r,
    velocity: b(o.velocity || 0) || 0,
    restSpeed: 0,
    restDelta: 0
  }, Q = () => {
    const w = Math.abs(V.delta) < 5;
    V.restSpeed = o.restSpeed || (w ? ce.restSpeed.granular : ce.restSpeed.default), V.restDelta = o.restDelta || (w ? ce.restDelta.granular : ce.restDelta.default);
  };
  Q();
  let Y, Z, q;
  if (_ < 1) {
    const w = _f(R, _), L = { A: 0, sinC: 0, cosC: 0, t: -1, env: 0, sin: 0, cos: 0 };
    q = () => {
      L.A = (V.velocity + B * V.delta) / w, L.sinC = B * L.A + V.delta * w, L.cosC = B * V.delta - L.A * w;
    };
    const pt = (rt) => {
      rt !== L.t && (L.t = rt, L.env = Math.exp(-B * rt), L.sin = Math.sin(w * rt), L.cos = Math.cos(w * rt));
    };
    Y = (rt) => (pt(rt), V.target - L.env * (L.A * L.sin + V.delta * L.cos)), Z = (rt) => (pt(rt), L.env * (L.sinC * L.sin + L.cosC * L.cos));
  } else if (_ === 1) {
    Y = (L) => V.target - Math.exp(-R * L) * (V.delta + (V.velocity + R * V.delta) * L);
    const w = { C: 0 };
    q = () => {
      w.C = V.velocity + R * V.delta;
    }, Z = (L) => Math.exp(-R * L) * (R * w.C * L - V.velocity);
  } else {
    const w = R * Math.sqrt(_ * _ - 1), L = B - w, pt = B + w, rt = g ? 1 / 0 : 300 / w, Yt = (Lt, Se) => Math.exp(Se > rt ? -Lt * rt - B * (Se - rt) : -Lt * Se), Ht = { S: 0, F: 0 };
    q = () => {
      const Lt = (V.velocity + B * V.delta) / w;
      Ht.S = (V.delta + Lt) / 2, Ht.F = (V.delta - Lt) / 2;
    }, Y = (Lt) => V.target - Ht.S * Yt(L, Lt) - Ht.F * Yt(pt, Lt), Z = (Lt) => L * Ht.S * Yt(L, Lt) + pt * Ht.F * Yt(pt, Lt);
  }
  q();
  const at = v && p || null, ot = {
    calculatedDuration: at,
    /**
     * Aim the spring at a new target from its current position and
     * velocity, reusing the resolved physics and closures.
     */
    retarget: (w, L) => {
      V.target = w[w.length - 1], V.delta = V.target - w[0], V.velocity = b(L), o.restSpeed && o.restDelta || Q(), ot.calculatedDuration = at, d.done = !1, q();
    },
    velocity: (w) => /* @__PURE__ */ ke(Z(w)),
    next: (w) => {
      const L = Y(w);
      if (v)
        d.done = w >= p;
      else {
        const pt = /* @__PURE__ */ ke(Z(w));
        d.done = Math.abs(pt) <= V.restSpeed && Math.abs(V.target - L) <= V.restDelta;
      }
      return d.value = d.done ? V.target : L, d;
    },
    toString: () => {
      const w = Math.min(mh(ot), dh), L = op((pt) => ot.next(w * pt).value, w, 30);
      return w + "ms " + L;
    },
    toTransition: () => {
    }
  };
  return ot;
}
oo.applyToOptions = (a) => {
  const l = EE(a, 100, oo);
  return a.ease = l.ease, a.duration = /* @__PURE__ */ ke(l.duration), a.type = "keyframes", a;
};
function Vf({ keyframes: a, velocity: l = 0, power: o = 0.8, timeConstant: r = 325, bounceDamping: c = 10, bounceStiffness: d = 500, modifyTarget: h, min: m, max: S, restDelta: p = 0.5, restSpeed: v }) {
  const g = a[0], b = {
    done: !1,
    value: g
  }, _ = (w) => w < m || w > S, R = (w) => m === void 0 ? S : S === void 0 || Math.abs(m - w) < Math.abs(S - w) ? m : S;
  let B = o * l;
  const V = g + B, Q = h === void 0 ? V : h(V);
  Q !== V && (B = Q - g);
  const Y = (w) => -B * Math.exp(-w / r), Z = (w) => {
    const L = Y(w);
    b.done = Math.abs(L) <= p, b.value = b.done ? Q : Q + L;
  };
  let q, at;
  const ot = (w) => {
    _(b.value) && (q = w, at = oo({
      keyframes: [b.value, R(b.value)],
      /**
       * The friction curve is target + calcDelta(t), so its exact
       * derivative is -calcDelta(t) / timeConstant in units/ms,
       * converted here to the units/second expected by spring.
       */
      velocity: -Y(w) / r * 1e3,
      damping: c,
      stiffness: d,
      restDelta: p,
      restSpeed: v
    }));
  };
  return ot(0), {
    calculatedDuration: null,
    next: (w) => {
      let L = !1;
      return !at && q === void 0 && (L = !0, Z(w), ot(w)), q !== void 0 && w >= q ? at.next(w - q) : (!L && Z(w), b);
    }
  };
}
function xE(a, l, o) {
  const r = [], c = o || Qn.mix || hh, d = a.length - 1;
  for (let h = 0; h < d; h++) {
    let m = c(a[h], a[h + 1]);
    if (l) {
      const S = Array.isArray(l) ? l[h] || Le : l;
      m = cu(S, m);
    }
    r.push(m);
  }
  return r;
}
function hp(a, l, { clamp: o = !0, ease: r, mixer: c } = {}) {
  const d = a.length;
  if (vo(d === l.length), d === 1)
    return () => l[0];
  if (d === 2 && l[0] === l[1])
    return () => l[1];
  const h = a[0] === a[1];
  a[0] > a[d - 1] && (a = [...a].reverse(), l = [...l].reverse());
  const m = xE(l, r, c), S = m.length, p = (v) => {
    if (h && v < a[0])
      return l[0];
    let g = 0;
    if (S > 1)
      for (; g < a.length - 2 && !(v < a[g + 1]); g++)
        ;
    const b = /* @__PURE__ */ Ii(a[g], a[g + 1], v);
    return m[g](b);
  };
  return o ? (v) => p(Mn(a[0], a[d - 1], v)) : p;
}
function CE(a, l) {
  const o = a[a.length - 1];
  for (let r = 1; r <= l; r++) {
    const c = /* @__PURE__ */ Ii(0, l, r);
    a.push(zt(o, 1, c));
  }
}
function OE(a) {
  const l = [0];
  return CE(l, a.length - 1), l;
}
function zE(a, l) {
  return a.map((o) => o * l);
}
function RE(a, l) {
  return a.map(() => l || sh).splice(0, a.length - 1);
}
function $l({ duration: a = 300, keyframes: l, times: o, ease: r = "easeInOut" }) {
  const c = /* @__PURE__ */ Gb(r) ? r.map(y0) : y0(r) || sh, d = {
    done: !1,
    value: l[0]
  };
  if (l.length === 2 && !Array.isArray(c) && (!o || o.length !== 2 || o[0] === 0 && o[1] === 1)) {
    const [S, p] = l, v = S === p ? void 0 : (Qn.mix || hh)(S, p);
    return {
      calculatedDuration: a,
      next: (g) => (d.value = v ? v(c(a > 0 ? Mn(0, 1, g / a) : 1)) : p, d.done = g >= a, d)
    };
  }
  const h = zE(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    o && o.length === l.length ? o : OE(l),
    a
  ), m = hp(h, l, {
    ease: Array.isArray(c) ? c : RE(l, c)
  });
  return {
    calculatedDuration: a,
    next: (S) => (d.value = m(S), d.done = S >= a, d)
  };
}
const _E = 5;
function NE(a, l, o) {
  const r = Math.max(l - _E, 0);
  return /* @__PURE__ */ ah(o - a(r), l - r);
}
function VE(a, l, o = 0) {
  return l <= 0 ? o : a.velocity ? a.velocity(l) : NE((r) => a.next(r).value, l, a.next(l).value);
}
const UE = (a) => a !== null;
function po(a, { repeat: l, repeatType: o = "loop" }, r, c = 1) {
  const d = a.filter(UE), m = c < 0 || l && o !== "loop" && l % 2 === 1 ? 0 : d.length - 1;
  return !m || r === void 0 ? d[m] : r;
}
const wE = {
  decay: Vf,
  inertia: Vf,
  tween: $l,
  keyframes: $l,
  spring: oo
};
function dp(a) {
  typeof a.type == "string" && (a.type = wE[a.type]);
}
function mp(a, l) {
  return {
    kind: a,
    animation: l,
    timestamp: fe.now(),
    frameTimestamp: Pt.timestamp,
    frameIsProcessing: Pt.isProcessing
  };
}
function yp(a, l, o) {
  const r = globalThis.__MOTION_INSPECT__;
  if (r)
    try {
      r({
        ...mp("animation-start", a),
        options: o ? { ...l, ...o } : l
      });
    } catch {
    }
}
function BE(a, l) {
  const o = globalThis.__MOTION_INSPECT__;
  if (o)
    try {
      o({
        ...mp("layout-animation-start", a),
        node: l
      });
    } catch {
    }
}
class yh {
  constructor() {
    this.isResolved = !1;
  }
  get finished() {
    return this._finished || (this._finished = this.isResolved ? Promise.resolve() : new Promise((l) => {
      this._resolve = l;
    })), this._finished;
  }
  updateFinished() {
    this._finished = this._resolve = void 0, this.isResolved = !1;
  }
  notifyFinished() {
    this.isResolved = !0, this._resolve?.();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(l, o) {
    return this.finished.then(l, o);
  }
}
const HE = (a) => a / 100;
class ro extends yh {
  constructor(l) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
      done: !1,
      value: void 0
    }, this.stop = () => {
      const { motionValue: o } = this.options;
      o && o.updatedAt !== fe.now() && this.tick(fe.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = l, this.initAnimation(), this.play(), l.autoplay === !1 && this.pause(), yp(this, this.options);
  }
  initAnimation() {
    const { options: l } = this;
    dp(l);
    const { type: o = $l, repeat: r = 0, repeatDelay: c = 0, repeatType: d, velocity: h = 0 } = l;
    let { keyframes: m } = l;
    const S = o || $l;
    S !== $l && typeof m[0] != "number" && (this.mixKeyframes = cu(HE, hh(m[0], m[1])), m = [0, 100]);
    const p = S(m === l.keyframes ? l : { ...l, keyframes: m });
    d === "mirror" && (this.mirroredGenerator = S({
      ...l,
      keyframes: [...m].reverse(),
      velocity: -h
    })), p.calculatedDuration === null && (p.calculatedDuration = mh(p));
    const { calculatedDuration: v } = p;
    this.calculatedDuration = v, this.resolvedDuration = v + c, this.totalDuration = this.resolvedDuration * (r + 1) - c, this.generator = p;
  }
  updateTime(l) {
    const o = Math.round(l - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = o;
  }
  tick(l, o = !1) {
    const { generator: r, totalDuration: c, mixKeyframes: d, mirroredGenerator: h, resolvedDuration: m, calculatedDuration: S } = this;
    if (this.startTime === null)
      return r.next(0);
    const { delay: p = 0, keyframes: v, repeat: g, repeatType: b, repeatDelay: _, type: R, onUpdate: B, finalKeyframe: V } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, l) : this.speed < 0 && (this.startTime = Math.min(l - c / this.speed, this.startTime)), o ? this.currentTime = l : this.updateTime(l);
    const Q = this.currentTime - p * (this.playbackSpeed >= 0 ? 1 : -1), Y = this.playbackSpeed >= 0 ? Q < 0 : Q > c;
    this.currentTime = Math.max(Q, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
    let Z = this.currentTime, q = r;
    if (g) {
      const L = Math.min(this.currentTime, c) / m;
      let pt = Math.floor(L), rt = L % 1;
      !rt && L >= 1 && (rt = 1), rt === 1 && pt--, pt = Math.min(pt, g + 1), pt % 2 && (b === "reverse" ? (rt = 1 - rt, _ && (rt -= _ / m)) : b === "mirror" && (q = h)), Z = Mn(0, 1, rt) * m;
    }
    let at;
    Y ? (this.delayState.value = v[0], at = this.delayState) : at = q.next(Z), d && !Y && (at.value = d(at.value));
    let { done: ot } = at;
    !Y && S !== null && (ot = this.playbackSpeed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
    const w = this.holdTime === null && (this.state === "finished" || this.state === "running" && ot);
    return w && R !== Vf && (at.value = po(v, this.options, V, this.speed)), B && B(at.value), w && this.finish(), at;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(l, o) {
    return this.finished.then(l, o);
  }
  get duration() {
    return /* @__PURE__ */ Fe(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ Fe(l);
  }
  get time() {
    return /* @__PURE__ */ Fe(this.currentTime);
  }
  set time(l) {
    l = /* @__PURE__ */ ke(l), this.currentTime = l, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = l : this.driver && (this.startTime = this.driver.now() - l / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = l, this.tick(l));
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    return VE(this.generator, this.currentTime, this.options.velocity);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(l) {
    const o = this.playbackSpeed !== l;
    o && this.driver && this.updateTime(fe.now()), this.playbackSpeed = l, o && this.driver && (this.time = /* @__PURE__ */ Fe(this.currentTime));
  }
  play() {
    if (this.isStopped)
      return;
    const { driver: l = bE, startTime: o } = this.options;
    this.driver || (this.driver = l((c) => this.tick(c))), this.options.onPlay?.();
    const r = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = r) : this.holdTime !== null ? this.startTime = r - this.holdTime : this.startTime || (this.startTime = o ?? r), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(fe.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(l) {
    return this.startTime = 0, this.tick(l, !0);
  }
  attachTimeline(l) {
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), l.observe(this);
  }
}
const LE = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function jE(a) {
  const [l, o] = a.slice(0, -1).split("(");
  if (l === "drop-shadow")
    return a;
  const [r] = o.match(rh) || [];
  if (!r)
    return a;
  const c = o.replace(r, "");
  let d = LE.has(l) ? 1 : 0;
  return r !== o && (d *= 100), l + "(" + d + c + ")";
}
const YE = /\b([a-z-]*)\(.*?\)/gu, Uf = {
  ...je,
  getAnimatableNone: (a) => {
    const l = a.match(YE);
    return l ? l.map(jE).join(" ") : a;
  }
}, wf = {
  ...je,
  getAnimatableNone: (a) => {
    const l = je.parse(a);
    return je.createTransformer(a)(l.map((r) => typeof r == "number" ? 0 : typeof r == "object" ? { ...r, alpha: 1 } : r));
  }
}, E0 = {
  ...$a,
  transform: Math.round
}, GE = {
  rotate: Xn,
  /**
   * Internal channel for `transition.path` orientToPath. Composed onto
   * `rotate` at the transform-build sites so the user's `rotate` is
   * never read or overwritten. Not part of `transformPropOrder`.
   */
  pathRotation: Xn,
  rotateX: Xn,
  rotateY: Xn,
  rotateZ: Xn,
  scale: Xs,
  scaleX: Xs,
  scaleY: Xs,
  scaleZ: Xs,
  skew: Xn,
  skewX: Xn,
  skewY: Xn,
  distance: P,
  translateX: P,
  translateY: P,
  translateZ: P,
  x: P,
  y: P,
  z: P,
  perspective: P,
  transformPerspective: P,
  opacity: iu,
  originX: v0,
  originY: v0,
  originZ: P
}, co = {
  // Border props
  borderWidth: P,
  borderTopWidth: P,
  borderRightWidth: P,
  borderBottomWidth: P,
  borderLeftWidth: P,
  borderRadius: P,
  borderTopLeftRadius: P,
  borderTopRightRadius: P,
  borderBottomRightRadius: P,
  borderBottomLeftRadius: P,
  // Positioning props
  width: P,
  maxWidth: P,
  height: P,
  maxHeight: P,
  top: P,
  right: P,
  bottom: P,
  left: P,
  inset: P,
  insetBlock: P,
  insetBlockStart: P,
  insetBlockEnd: P,
  insetInline: P,
  insetInlineStart: P,
  insetInlineEnd: P,
  // Spacing props
  padding: P,
  paddingTop: P,
  paddingRight: P,
  paddingBottom: P,
  paddingLeft: P,
  paddingBlock: P,
  paddingBlockStart: P,
  paddingBlockEnd: P,
  paddingInline: P,
  paddingInlineStart: P,
  paddingInlineEnd: P,
  margin: P,
  marginTop: P,
  marginRight: P,
  marginBottom: P,
  marginLeft: P,
  marginBlock: P,
  marginBlockStart: P,
  marginBlockEnd: P,
  marginInline: P,
  marginInlineStart: P,
  marginInlineEnd: P,
  // Typography
  fontSize: P,
  // Misc
  backgroundPositionX: P,
  backgroundPositionY: P,
  ...GE,
  zIndex: E0,
  // SVG
  fillOpacity: iu,
  strokeOpacity: iu,
  numOctaves: E0
}, qE = {
  ...co,
  // Color props
  color: Wt,
  backgroundColor: Wt,
  outlineColor: Wt,
  fill: Wt,
  stroke: Wt,
  // Border props
  borderColor: Wt,
  borderTopColor: Wt,
  borderRightColor: Wt,
  borderBottomColor: Wt,
  borderLeftColor: Wt,
  filter: Uf,
  WebkitFilter: Uf,
  mask: wf,
  WebkitMask: wf
}, gp = (a) => qE[a], XE = /* @__PURE__ */ new Set([Uf, wf]);
function gh(a, l) {
  let o = gp(a);
  return XE.has(o) || (o = je), o.getAnimatableNone ? o.getAnimatableNone(l) : void 0;
}
function QE(a) {
  for (let l = 1; l < a.length; l++)
    a[l] ?? (a[l] = a[l - 1]);
}
const Pi = (a) => a * 180 / Math.PI, Bf = (a) => {
  const l = Pi(Math.atan2(a[1], a[0]));
  return Hf(l);
}, ZE = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (a) => (Math.abs(a[0]) + Math.abs(a[3])) / 2,
  rotate: Bf,
  rotateZ: Bf,
  skewX: (a) => Pi(Math.atan(a[1])),
  skewY: (a) => Pi(Math.atan(a[2])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[2])) / 2
}, Hf = (a) => (a = a % 360, a < 0 && (a += 360), a), A0 = Bf, D0 = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]), M0 = (a) => Math.sqrt(a[4] * a[4] + a[5] * a[5]), KE = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: D0,
  scaleY: M0,
  scale: (a) => (D0(a) + M0(a)) / 2,
  rotateX: (a) => Hf(Pi(Math.atan2(a[6], a[5]))),
  rotateY: (a) => Hf(Pi(Math.atan2(-a[2], a[0]))),
  rotateZ: A0,
  rotate: A0,
  skewX: (a) => Pi(Math.atan(a[4])),
  skewY: (a) => Pi(Math.atan(a[1])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[4])) / 2
};
function lu(a) {
  return a.includes("scale") ? 1 : 0;
}
function Lf(a, l) {
  if (!a || a === "none")
    return lu(l);
  const o = a.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let r, c;
  if (o)
    r = KE, c = o;
  else {
    const m = a.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    r = ZE, c = m;
  }
  if (!c)
    return lu(l);
  const d = r[l], h = c[1].split(",").map(PE);
  return typeof d == "function" ? d(h) : h[d];
}
const JE = (a, l) => {
  const { transform: o = "none" } = getComputedStyle(a);
  return Lf(o, l);
};
function PE(a) {
  return parseFloat(a.trim());
}
const tl = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Ti = /* @__PURE__ */ new Set([...tl, "pathRotation"]), x0 = (a) => a === $a || a === P, FE = /* @__PURE__ */ new Set(["x", "y", "z"]), kE = tl.filter((a) => !FE.has(a));
function WE(a) {
  const l = [];
  return kE.forEach((o) => {
    const r = a.getValue(o);
    if (r !== void 0) {
      const c = r.get(), d = o.startsWith("scale") ? 1 : 0;
      if (c === d)
        return;
      l.push([o, c]), r.set(d);
    }
  }), l;
}
const IE = /* @__PURE__ */ new Set(["bottom", "right"]);
function C0(a, l, o, r, c, d) {
  const h = parseFloat(a);
  if (!isNaN(h))
    return h;
  const { min: m, max: S } = l()[o], p = S - m;
  return d === "border-box" ? p : p - parseFloat(r) - parseFloat(c);
}
const Fi = {
  // Dimensions
  width: ({ width: a, paddingLeft: l = "0", paddingRight: o = "0", boxSizing: r }, c) => C0(a, c, "x", l, o, r),
  height: ({ height: a, paddingTop: l = "0", paddingBottom: o = "0", boxSizing: r }, c) => C0(a, c, "y", l, o, r),
  top: ({ top: a }) => parseFloat(a),
  left: ({ left: a }) => parseFloat(a),
  bottom: ({ top: a }, l) => {
    const { y: o } = l();
    return parseFloat(a) + (o.max - o.min);
  },
  right: ({ left: a }, l) => {
    const { x: o } = l();
    return parseFloat(a) + (o.max - o.min);
  },
  // Transform
  x: ({ transform: a }) => Lf(a, "x"),
  y: ({ transform: a }) => Lf(a, "y")
};
Fi.translateX = Fi.x;
Fi.translateY = Fi.y;
const ki = /* @__PURE__ */ new Set();
let jf = !1, Yf = !1, Gf = !1;
function vp() {
  if (Yf) {
    const a = [], l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
    ki.forEach((c) => {
      c.needsMeasurement && (a.push(c), l.add(c.element), IE.has(c.name) && o.add(c.element));
    });
    const r = /* @__PURE__ */ new Map();
    o.forEach((c) => {
      const d = WE(c);
      d.length && (r.set(c, d), c.render());
    }), a.forEach((c) => c.measureInitialState()), l.forEach((c) => {
      c.render();
      const d = r.get(c);
      d && d.forEach(([h, m]) => {
        c.getValue(h)?.set(m);
      });
    }), a.forEach((c) => c.measureEndState()), a.forEach((c) => {
      c.suspendedScrollY !== void 0 && window.scrollTo(0, c.suspendedScrollY);
    });
  }
  Yf = !1, jf = !1, ki.forEach((a) => a.complete(Gf)), ki.clear();
}
function pp() {
  ki.forEach((a) => {
    a.readKeyframes(), a.needsMeasurement && (Yf = !0);
  });
}
function $E() {
  Gf = !0, pp(), vp(), Gf = !1;
}
function tA(a, l, o) {
  if (typeof a == "string") {
    if (nh(a) || ih(a))
      return parseFloat(a);
    if (!je.test(a) && je.test(o))
      return gh(l, o);
  }
  return a ?? void 0;
}
class vh {
  constructor(l, o, r, c, d, h = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...l], this.onComplete = o, this.name = r, this.motionValue = c, this.element = d, this.isAsync = h;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (ki.add(this), jf || (jf = !0, bt.read(pp), bt.resolveKeyframes(vp))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, name: o, element: r, motionValue: c } = this;
    if (l[0] === null) {
      const d = c?.get(), h = l[l.length - 1];
      if (d !== void 0)
        l[0] = d;
      else if (r && o) {
        const m = tA(r.readValue(o, h), o, h);
        m !== void 0 && (l[0] = m);
      }
      l[0] === void 0 && (l[0] = h), c && d === void 0 && c.set(l[0]);
    }
    QE(l);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(l = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, l), ki.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (ki.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const eA = (a) => a.startsWith("--");
function Sp(a, l, o) {
  eA(l) ? a.style.setProperty(l, o) : a.style[l] = o;
}
const nA = {};
function ph(a, l) {
  const o = /* @__PURE__ */ qv(a);
  return () => nA[l] ?? o();
}
const Sh = /* @__PURE__ */ ph(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Tp = /* @__PURE__ */ ph(() => window.ViewTimeline !== void 0, "viewTimeline"), bp = /* @__PURE__ */ ph(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Il = ([a, l, o, r]) => `cubic-bezier(${a}, ${l}, ${o}, ${r})`, O0 = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Il([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Il([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Il([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Il([0.33, 1.53, 0.69, 0.99])
};
function Ep(a, l) {
  if (a)
    return typeof a == "function" ? bp() ? op(a, l) : "ease-out" : /* @__PURE__ */ Wv(a) ? Il(a) : Array.isArray(a) ? a.map((o) => Ep(o, l) || O0.easeOut) : O0[a];
}
function iA(a, l, o, { delay: r = 0, duration: c = 300, repeat: d = 0, repeatType: h = "loop", ease: m = "easeOut", times: S } = {}, p = void 0) {
  const v = {
    [l]: o
  };
  S && (v.offset = S);
  const g = Ep(m, c);
  Array.isArray(g) && (v.easing = g);
  const b = {
    delay: r,
    duration: c,
    easing: Array.isArray(g) ? "linear" : g,
    fill: "both",
    iterations: d + 1,
    direction: h === "reverse" ? "alternate" : "normal"
  };
  return p && (b.pseudoElement = p), a.animate(v, b);
}
function Ap(a) {
  return typeof a == "function" && "applyToOptions" in a;
}
function aA({ type: a, ...l }) {
  return Ap(a) && bp() ? a.applyToOptions(l) : (l.duration ?? (l.duration = 300), l.ease ?? (l.ease = "easeOut"), l);
}
class Dp extends yh {
  constructor(l) {
    if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !l)
      return;
    const { element: o, name: r, keyframes: c, pseudoElement: d, allowFlatten: h = !1, finalKeyframe: m, onComplete: S } = l;
    this.isPseudoElement = !!d, this.allowFlatten = h, this.options = l, vo(typeof l.type != "string");
    const p = aA(l);
    this.animation = iA(o, r, c, p, d), p.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !d) {
        const v = po(c, this.options, m, this.speed);
        this.updateMotionValue && this.updateMotionValue(v), Sp(o, r, v), this.animation.cancel();
      }
      S?.(), this.notifyFinished();
    }, yp(this, l, p);
  }
  play() {
    this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: l } = this;
    l === "idle" || l === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    const l = this.options?.element;
    !this.isPseudoElement && l?.isConnected && this.animation.commitStyles?.();
  }
  get duration() {
    const l = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ Fe(Number(l));
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ Fe(l);
  }
  get time() {
    return /* @__PURE__ */ Fe(Number(this.animation.currentTime) || 0);
  }
  set time(l) {
    const o = this.finishedTime !== null;
    this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ ke(l), o && this.animation.pause();
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(l) {
    l < 0 && (this.finishedTime = null), this.animation.playbackRate = l;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(l) {
    this.manualStartTime = this.animation.startTime = l;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: l, onAttach: o, observe: r }) {
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, l && Sh() ? (this.animation.timeline = l, o?.(this.animation), Le) : r(this);
  }
}
const Mp = {
  anticipate: Pv,
  backInOut: Jv,
  circInOut: kv
};
function lA(a) {
  return a in Mp;
}
function uA(a) {
  typeof a.ease == "string" && lA(a.ease) && (a.ease = Mp[a.ease]);
}
const vf = 10;
class sA extends Dp {
  constructor(l) {
    uA(l), dp(l), super(l), l.startTime !== void 0 && l.autoplay !== !1 && (this.startTime = l.startTime), this.options = l;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(l) {
    const { motionValue: o, onUpdate: r, onComplete: c, element: d, ...h } = this.options;
    if (!o)
      return;
    if (l !== void 0) {
      o.set(l);
      return;
    }
    const m = new ro({
      ...h,
      autoplay: !1
    }), S = Math.max(vf, fe.now() - this.startTime), p = Mn(0, vf, S - vf), v = m.sample(S).value, { name: g } = this.options;
    d && g && Sp(d, g, v), o.setWithVelocity(m.sample(Math.max(0, S - p)).value, v, p), m.stop();
  }
}
const z0 = (a, l) => l === "zIndex" ? !1 : !!(typeof a == "number" || Array.isArray(a) || typeof a == "string" && // It's animatable if we have a string
(je.test(a) || a === "0") && // And it contains numbers and/or colors
!a.startsWith("url("));
function oA(a) {
  const l = a[0];
  if (a.length === 1)
    return !0;
  for (let o = 0; o < a.length; o++)
    if (a[o] !== l)
      return !0;
}
function rA(a, l, o, r) {
  const c = a[0];
  if (c === null)
    return !1;
  if (l === "display" || l === "visibility")
    return !0;
  const d = a[a.length - 1], h = z0(c, l), m = z0(d, l);
  return !h || !m ? !1 : oA(a) || (o === "spring" || Ap(o)) && r;
}
function qf(a) {
  a.duration = 0, a.type = "keyframes";
}
const Xf = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform",
  "backgroundColor"
]), cA = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function fA(a) {
  for (let l = 0; l < a.length; l++)
    if (typeof a[l] == "string" && cA.test(a[l]))
      return !0;
  return !1;
}
const R0 = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]), hA = /* @__PURE__ */ qv(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function dA(a) {
  const { motionValue: l, name: o, repeatDelay: r, repeatType: c, damping: d, type: h, keyframes: m } = a;
  if (!o || !(Xf.has(o) || R0.has(o)))
    return !1;
  const S = l?.owner?.current;
  if (!(S instanceof HTMLElement) && !(S instanceof SVGElement))
    return !1;
  const { onUpdate: p, transformTemplate: v } = l.owner.getProps();
  return hA() && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  (Xf.has(o) || R0.has(o) && fA(m)) && (o !== "transform" || !v) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !p && !r && c !== "mirror" && d !== 0 && h !== "inertia";
}
const mA = 40;
class yA extends yh {
  constructor(l) {
    super(), this.stop = () => {
      this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
    }, this.createdAt = fe.now();
    const { keyframes: o, name: r, motionValue: c, element: d } = l, h = l;
    h.autoplay ?? (h.autoplay = !0), h.delay ?? (h.delay = 0), h.type ?? (h.type = "keyframes"), h.repeat ?? (h.repeat = 0), h.repeatDelay ?? (h.repeatDelay = 0), h.repeatType ?? (h.repeatType = "loop");
    const m = d?.KeyframeResolver || vh;
    this.keyframeResolver = new m(o, (S, p, v) => this.onKeyframesResolved(S, p, h, !v), r, c, d), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(l, o, r, c) {
    this.keyframeResolver = void 0;
    const { name: d, type: h, velocity: m, delay: S, isHandoff: p, onUpdate: v } = r;
    this.resolvedAt = fe.now();
    let g = !0;
    rA(l, d, h, m) || (g = !1, (Qn.instantAnimations || !S) && v?.(po(l, r, o)), l[0] = l[l.length - 1], qf(r), r.repeat = 0);
    const b = c ? this.resolvedAt ? this.resolvedAt - this.createdAt > mA ? this.resolvedAt : this.createdAt : this.createdAt : void 0, { onComplete: _ } = r;
    r.startTime ?? (r.startTime = b), r.finalKeyframe = o, r.keyframes = l, r.onComplete = () => {
      _?.(), this.notifyFinished();
    };
    const R = g && !p && dA(r);
    let B;
    if (R) {
      r.element = r.motionValue?.owner?.current;
      try {
        B = new sA(r);
      } catch {
        B = new ro(r);
      }
    } else
      B = new ro(r);
    this.pendingTimeline && (this.stopTimeline = B.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = B;
  }
  get finished() {
    return this._animation ? this._animation.finished : super.finished;
  }
  then(l, o) {
    return this.finished.finally(l).then(() => {
    });
  }
  get animation() {
    return this._animation || (this.keyframeResolver?.resume(), $E()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(l) {
    this.animation.time = l;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(l) {
    this.animation.speed = l;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(l) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(l) : this.pendingTimeline = l, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
  }
}
function xp(a, l, o, r = 0, c = 1) {
  const d = Array.from(a).sort((p, v) => p.sortNodePosition(v)).indexOf(l), h = a.size, m = (h - 1) * r;
  return typeof o == "function" ? o(d, h) : c === 1 ? d * r : m - d * r;
}
const _0 = 30, gA = (a) => !isNaN(parseFloat(a)), tu = {
  current: void 0
};
class vA {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(l, o = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r) => {
      const c = fe.now();
      if (this.updatedAt !== c && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && (this.notifyChange(), this.dependents))
        for (const d of this.dependents)
          d.dirty();
    }, this.hasAnimated = !1, this.setCurrent(l), this.owner = o.owner;
  }
  setCurrent(l) {
    this.current = l, this.updatedAt = fe.now(), this.canTrackVelocity === null && l !== void 0 && (this.canTrackVelocity = gA(this.current));
  }
  setPrevFrameValue(l = this.current) {
    this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(l) {
    return this.on("change", l);
  }
  on(l, o) {
    var r;
    return l === "change" ? this.onChangeSubscribe(o) : ((r = this.events)[l] || (r[l] = new uo())).add(o);
  }
  onChangeSubscribe(l) {
    const { events: o } = this;
    return !o.change && !this.changeSubscriber ? this.changeSubscriber = l : (o.change || (o.change = new uo(), o.change.add(this.changeSubscriber), this.changeSubscriber = void 0), o.change.add(l)), () => {
      this.changeSubscriber === l ? this.changeSubscriber = void 0 : o.change?.remove(l), this.stopIfUnobserved();
    };
  }
  /**
   * If we have no more change listeners by the start
   * of the next frame, stop active animations.
   */
  stopIfUnobserved() {
    bt.read(() => {
      !this.changeSubscriber && !this.events.change?.getSize() && this.stop();
    });
  }
  clearListeners() {
    this.changeSubscriber = void 0;
    for (const l in this.events)
      this.events[l].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(l, o) {
    this.passiveEffect = l, this.stopPassiveEffect = o;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(l) {
    this.passiveEffect ? this.passiveEffect(l, this.updateAndNotify) : this.updateAndNotify(l);
  }
  setWithVelocity(l, o, r) {
    this.set(o), this.prev = void 0, this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt - r;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(l, o = !0) {
    this.updateAndNotify(l), this.prev = l, this.prevUpdatedAt = this.prevFrameValue = void 0, o && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    this.notifyChange();
  }
  notifyChange() {
    const { current: l, changeSubscriber: o } = this;
    o ? o(l) : this.events.change?.notify(l);
  }
  addDependent(l) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(l);
  }
  removeDependent(l) {
    this.dependents && this.dependents.delete(l);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return tu.current && tu.current.push(this), this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const l = fe.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || l - this.updatedAt > _0)
      return 0;
    const o = Math.min(this.updatedAt - this.prevUpdatedAt, _0);
    return /* @__PURE__ */ ah(parseFloat(this.current) - parseFloat(this.prevFrameValue), o);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(l) {
    return this.stop(), new Promise((o) => {
      this.hasAnimated = !0;
      let r = !1, c;
      c = l(() => {
        r = !0, this.events.animationComplete?.notify(), this.animation === c && this.clearAnimation(), o();
      }), r || (this.animation = c), this.events.animationStart?.notify();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    this.animation = void 0;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function un(a, l) {
  return new vA(a, l);
}
function Cp(a, l) {
  if (a?.inherit && l) {
    const { inherit: o, ...r } = a;
    return { ...l, ...r };
  }
  return a;
}
function Th(a, l) {
  const o = a?.[l] ?? a?.default ?? a;
  return o !== a ? Cp(o, a) : o;
}
const pA = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, SA = (a) => ({
  type: "spring",
  stiffness: 550,
  damping: a === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), TA = {
  type: "keyframes",
  duration: 0.8
}, bA = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, EA = (a, { keyframes: l }) => l.length > 2 ? TA : Ti.has(a) ? a.startsWith("scale") ? SA(l[1]) : pA : bA, AA = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function DA(a) {
  for (const l in a)
    if (!AA.has(l))
      return !0;
  return !1;
}
const bh = (a, l, o, r = {}, c, d) => (h) => {
  const m = Th(r, a) || {}, S = m.delay || r.delay || 0;
  let { elapsed: p = 0 } = r;
  p = p - /* @__PURE__ */ ke(S);
  const v = {
    keyframes: Array.isArray(o) ? o : [null, o],
    ease: "easeOut",
    velocity: l.getVelocity(),
    ...m,
    delay: -p,
    onUpdate: (b) => {
      l.set(b), m.onUpdate && m.onUpdate(b);
    },
    onComplete: () => {
      h(), m.onComplete && m.onComplete();
    },
    name: a,
    motionValue: l,
    element: d ? void 0 : c
  };
  DA(m) || Object.assign(v, EA(a, v)), v.duration && (v.duration = /* @__PURE__ */ ke(v.duration)), v.repeatDelay && (v.repeatDelay = /* @__PURE__ */ ke(v.repeatDelay)), v.from !== void 0 && (v.keyframes[0] = v.from);
  let g = !1;
  if ((v.type === !1 || v.duration === 0 && !v.repeatDelay) && (qf(v), v.delay === 0 && (g = !0)), (Qn.instantAnimations || Qn.skipAnimations || c?.shouldSkipAnimations || m.skipAnimations) && (g = !0, qf(v), v.delay = 0), v.allowFlatten = !m.type && !m.ease, g && !d && l.get() !== void 0) {
    const b = po(v.keyframes, m);
    if (b !== void 0) {
      bt.update(() => {
        v.onUpdate(b), v.onComplete();
      });
      return;
    }
  }
  return m.isSync ? new ro(v) : new yA(v);
}, MA = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function xA(a) {
  const l = MA.exec(a);
  if (!l)
    return [,];
  const [, o, r, c] = l;
  return [`--${o ?? r}`, c];
}
function Op(a, l, o = 1) {
  const [r, c] = xA(a);
  if (!r)
    return;
  const d = window.getComputedStyle(l).getPropertyValue(r);
  if (d) {
    const h = d.trim();
    return nh(h) ? parseFloat(h) : h;
  }
  return oh(c) ? Op(c, l, o + 1) : c;
}
function CA(a) {
  const l = [{}, {}];
  return a?.values.forEach((o, r) => {
    l[0][r] = o.get(), l[1][r] = o.getVelocity();
  }), l;
}
function zp(a, l, o, r) {
  const c = (d) => typeof d == "function" ? d(o !== void 0 ? o : a.custom, ...CA(r)) : d;
  return l = c(l), typeof l == "string" && (l = a.variants && a.variants[l]), c(l);
}
function Wi(a, l, o) {
  return zp(a.getProps(), l, o, a);
}
const Rp = (a, l) => l === "exit" ? a.presenceContext?.custom : void 0, _p = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...tl
]), OA = (a) => Array.isArray(a);
function zA(a, l, o) {
  a.hasValue(l) ? a.getValue(l).set(o) : a.addValue(l, un(o));
}
function RA(a) {
  return OA(a) ? a[a.length - 1] || 0 : a;
}
function _A(a, l) {
  const o = Wi(a, l);
  let { transitionEnd: r = {}, transition: c = {}, ...d } = o || {};
  d = { ...d, ...r };
  for (const h in d) {
    const m = RA(d[h]);
    zA(a, h, m);
  }
}
const he = (a) => !!(a && a.getVelocity);
function NA(a) {
  return !!(he(a) && a.add);
}
function Qf(a, l) {
  const o = a.getValue("willChange");
  if (NA(o))
    return o.add(l);
  if (!o && Qn.WillChange) {
    const r = new Qn.WillChange("auto");
    a.addValue("willChange", r), r.add(l);
  }
}
function Eh(a) {
  return a.replace(/([A-Z])/g, (l) => `-${l.toLowerCase()}`);
}
const VA = "framerAppearId", Np = "data-" + Eh(VA);
function Vp(a) {
  return a.props[Np];
}
const UA = typeof window < "u";
function wA({ protectedKeys: a, needsAnimating: l }, o) {
  const r = o in a && !l[o];
  return l[o] = !1, r;
}
function Up(a, l, { delay: o = 0, transitionOverride: r, type: c } = {}) {
  let { transition: d, transitionEnd: h, ...m } = l;
  const S = a.getDefaultTransition();
  d = d ? Cp(d, S) : S;
  const p = d?.reduceMotion, v = d?.skipAnimations;
  r && (d = r);
  const g = [], b = c && a.animationState?.getState()[c], _ = d?.path;
  _ && _.animateVisualElement(a, m, d, o, g);
  for (const R in m) {
    const B = a.getValue(R, a.latestValues[R] ?? null), V = m[R];
    if (V === void 0 || b && wA(b, R))
      continue;
    const Q = {
      delay: o,
      ...Th(d || {}, R)
    };
    v && (Q.skipAnimations = !0);
    const Y = B.get();
    if (Y !== void 0 && !B.isAnimating() && !Array.isArray(V) && V === Y && !Q.velocity) {
      bt.update(() => B.set(V));
      continue;
    }
    let Z = !1;
    if (UA && window.MotionHandoffAnimation) {
      const ot = Vp(a);
      if (ot) {
        const w = window.MotionHandoffAnimation(ot, R, bt);
        w !== null && (Q.startTime = w, Z = !0);
      }
    }
    Qf(a, R);
    const q = p ?? a.shouldReduceMotion;
    B.start(bh(R, B, V, q && _p.has(R) ? { type: !1 } : Q, a, Z));
    const at = B.animation;
    at && g.push(at);
  }
  if (h) {
    const R = () => bt.update(() => {
      h && _A(a, h);
    });
    g.length ? Promise.all(g).then(R) : R();
  }
  return g;
}
function Zf(a, l, o = {}) {
  const r = Wi(a, l, Rp(a, o.type)), c = o.transitionOverride || (r?.transition ?? (a.getDefaultTransition() || {})), d = () => Promise.all(r ? Up(a, r, o) : []), h = (S = 0) => {
    const { variantChildren: p } = a, { delayChildren: v = 0, staggerChildren: g, staggerDirection: b } = c, _ = [];
    return p?.forEach((R) => {
      R.notify("AnimationStart", l), _.push(Zf(R, l, {
        ...o,
        delay: S + (typeof v == "function" ? 0 : v) + xp(p, R, v, g, b)
      }).then(() => R.notify("AnimationComplete", l)));
    }), Promise.all(_);
  }, { when: m } = c;
  return m ? m === "beforeChildren" ? d().then(() => h()) : h().then(d) : Promise.all([d(), h(o.delay)]);
}
function BA(a, l, o = {}) {
  return a.notify("AnimationStart", l), (Array.isArray(l) ? Promise.all(l.map((c) => Zf(a, c, o))) : typeof l == "string" ? Zf(a, l, o) : Promise.all(Up(a, Wi(a, l, o.custom), o))).then(() => {
    a.notify("AnimationComplete", l);
  });
}
const HA = {
  test: (a) => a === "auto",
  parse: (a) => a
}, LA = (a) => (l) => l.test(a), jA = [$a, P, Dn, Xn, Ib, Wb, HA], N0 = (a) => jA.find(LA(a));
function YA(a) {
  return typeof a == "number" ? a === 0 : a !== null ? a === "none" || a === "0" || ih(a) : !0;
}
const GA = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function qA(a, l, o) {
  let r = 0, c;
  for (; r < a.length && !c; ) {
    const d = a[r];
    typeof d == "string" && !GA.has(d) && aE(d) && (c = a[r]), r++;
  }
  if (c && o)
    for (const d of l)
      a[d] !== c && (a[d] = gh(o, c));
}
class XA extends vh {
  constructor(l, o, r, c, d) {
    super(l, o, r, c, d, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, element: o, name: r } = this;
    if (!o || !o.current)
      return;
    super.readKeyframes();
    for (let v = 0; v < l.length; v++) {
      let g = l[v];
      if (typeof g == "string" && (g = g.trim(), oh(g))) {
        const b = Op(g, o.current);
        b !== void 0 && (l[v] = b), v === l.length - 1 && (this.finalKeyframe = g);
      }
    }
    if (this.resolveNoneKeyframes(), !_p.has(r) || l.length !== 2)
      return;
    const [c, d] = l;
    if (typeof c == "number" && typeof d == "number")
      return;
    const h = N0(c), m = N0(d), S = g0(c), p = g0(d);
    if (S !== p && Fi[r]) {
      this.needsMeasurement = !0;
      return;
    }
    if (h !== m)
      if (x0(h) && x0(m))
        for (let v = 0; v < l.length; v++) {
          const g = l[v];
          typeof g == "string" && (l[v] = parseFloat(g));
        }
      else Fi[r] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: l, name: o } = this, r = [];
    for (let c = 0; c < l.length; c++)
      (l[c] === null || YA(l[c])) && r.push(c);
    r.length && qA(l, r, o);
  }
  measure() {
    const { element: l, name: o } = this;
    return Fi[o](window.getComputedStyle(l.current), () => l.measureViewportBox());
  }
  measureInitialState() {
    const { element: l, unresolvedKeyframes: o, name: r } = this;
    if (!l || !l.current)
      return;
    r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), o[0] = this.measuredOrigin;
    const c = o[o.length - 1];
    c !== void 0 && this.motionValue?.jump(c, !1);
  }
  measureEndState() {
    const { element: l, unresolvedKeyframes: o } = this;
    if (!l || !l.current)
      return;
    this.motionValue?.jump(this.measuredOrigin, !1);
    const r = o.length - 1, c = o[r];
    o[r] = this.measure(), c !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = c), this.removedTransforms?.length && this.removedTransforms.forEach(([d, h]) => {
      l.getValue(d).set(h);
    }), this.resolveNoneKeyframes();
  }
}
const Ah = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius"
];
function wp(a) {
  return Gv(a) && "offsetHeight" in a && !("ownerSVGElement" in a);
}
function Dh(a) {
  return Gv(a) && "ownerSVGElement" in a;
}
const Kf = (a, l) => l && typeof a == "number" ? l.transform(a) : a;
function Bp(a, l, o) {
  if (a == null)
    return [];
  if (a instanceof EventTarget)
    return [a];
  if (typeof a == "string") {
    const c = document.querySelectorAll(a);
    return c ? Array.from(c) : [];
  }
  return Array.from(a).filter((r) => r != null);
}
const QA = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, ZA = tl.length;
function KA(a, l, o) {
  let r = "", c = !0;
  for (let h = 0; h < ZA; h++) {
    const m = tl[h], S = a[m];
    if (S === void 0)
      continue;
    let p = !0;
    if (typeof S == "number")
      p = S === (m.startsWith("scale") ? 1 : 0);
    else {
      const v = parseFloat(S);
      p = m.startsWith("scale") ? v === 1 : v === 0;
    }
    if (!p || o) {
      const v = Kf(S, co[m]);
      if (!p) {
        c = !1;
        const g = QA[m] || m;
        r += `${g}(${v}) `;
      }
      o && (l[m] = v);
    }
  }
  const d = a.pathRotation;
  return d && (c = !1, r += `rotate(${Kf(d, co.pathRotation)}) `), r = r.trim(), o ? r = o(l, c ? "" : r) : c && (r = "none"), r;
}
function Mh(a, l, o) {
  const { style: r, vars: c, transformOrigin: d } = a;
  let h = !1, m = !1;
  for (const S in l) {
    const p = l[S];
    if (Ti.has(S)) {
      h = !0;
      continue;
    } else if ($v(S)) {
      c[S] = p;
      continue;
    } else {
      const v = Kf(p, co[S]);
      S.startsWith("origin") ? (m = !0, d[S] = v) : r[S] = v;
    }
  }
  if (l.transform || (h || o ? r.transform = KA(l, a.transform, o) : r.transform && (r.transform = "none")), m) {
    const { originX: S = "50%", originY: p = "50%", originZ: v = 0 } = d;
    r.transformOrigin = `${S} ${p} ${v}`;
  }
}
const JA = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, PA = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function FA(a, l, o = 1, r = 0, c = !0) {
  a.pathLength = 1;
  const d = c ? JA : PA;
  a[d.offset] = `${-r}`, a[d.array] = `${l} ${o}`;
}
const Hp = [
  "transform",
  "opacity",
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function Lp(a, {
  attrX: l,
  attrY: o,
  attrScale: r,
  pathLength: c,
  pathSpacing: d = 1,
  pathOffset: h = 0,
  // This is object creation, which we try to avoid per-frame.
  ...m
}, S, p, v) {
  if (Mh(a, m, p), S) {
    a.style.viewBox && (a.attrs.viewBox = a.style.viewBox);
    return;
  }
  a.attrs = a.style, a.style = {};
  const { attrs: g, style: b } = a;
  for (const _ of Hp)
    g[_] !== void 0 && (b[_] = g[_], delete g[_]);
  (b.transform || g.transformOrigin) && (b.transformOrigin = g.transformOrigin ?? "50% 50%", delete g.transformOrigin), b.transform && (b.transformBox = v?.transformBox ?? "fill-box", delete g.transformBox), l !== void 0 && (g.x = l), o !== void 0 && (g.y = o), r !== void 0 && (g.scale = r), c !== void 0 && FA(g, c, d, h, !1);
}
function jp({ top: a, left: l, right: o, bottom: r }) {
  return {
    x: { min: l, max: o },
    y: { min: a, max: r }
  };
}
function kA({ x: a, y: l }) {
  return { top: l.min, right: a.max, bottom: l.max, left: a.min };
}
function WA(a, l) {
  if (!l)
    return a;
  const o = l({ x: a.left, y: a.top }), r = l({ x: a.right, y: a.bottom });
  return {
    top: o.y,
    left: o.x,
    bottom: r.y,
    right: r.x
  };
}
function pf(a) {
  return a === void 0 || a === 1;
}
function Jf({ scale: a, scaleX: l, scaleY: o }) {
  return !pf(a) || !pf(l) || !pf(o);
}
function Ki(a) {
  return Jf(a) || Yp(a) || a.z || a.rotate || a.rotateX || a.rotateY || a.skewX || a.skewY;
}
function Yp(a) {
  return V0(a.x) || V0(a.y);
}
function V0(a) {
  return a && a !== "0%";
}
function fo(a, l, o) {
  const r = a - o, c = l * r;
  return o + c;
}
function U0(a, l, o, r, c) {
  return c !== void 0 && (a = fo(a, c, r)), fo(a, o, r) + l;
}
function Pf(a, l = 0, o = 1, r, c) {
  a.min = U0(a.min, l, o, r, c), a.max = U0(a.max, l, o, r, c);
}
function Gp(a, { x: l, y: o }) {
  Pf(a.x, l.translate, l.scale, l.originPoint), Pf(a.y, o.translate, o.scale, o.originPoint);
}
const w0 = 0.999999999999, B0 = 1.0000000000001;
function IA(a, l, o, r = !1) {
  const c = o.length;
  if (!c)
    return;
  l.x = l.y = 1;
  let d, h;
  for (let m = 0; m < c; m++) {
    d = o[m], h = d.projectionDelta;
    const { visualElement: S } = d.options;
    S && S.props.style && S.props.style.display === "contents" || (r && d.options.layoutScroll && d.scroll && d !== d.root && (En(a.x, -d.scroll.offset.x), En(a.y, -d.scroll.offset.y)), h && (l.x *= h.x.scale, l.y *= h.y.scale, Gp(a, h)), r && Ki(d.latestValues) && ks(a, d.latestValues, d.layout?.layoutBox));
  }
  l.x < B0 && l.x > w0 && (l.x = 1), l.y < B0 && l.y > w0 && (l.y = 1);
}
function En(a, l) {
  a.min += l, a.max += l;
}
function H0(a, l, o, r, c = 0.5) {
  const d = zt(a.min, a.max, c);
  Pf(a, l, o, d, r);
}
function L0(a, l) {
  return typeof a == "string" ? parseFloat(a) / 100 * (l.max - l.min) : a;
}
function ks(a, l, o) {
  const r = o ?? a;
  H0(a.x, L0(l.x, r.x), l.scaleX, l.scale, l.originX), H0(a.y, L0(l.y, r.y), l.scaleY, l.scale, l.originY);
}
function qp(a, l) {
  return jp(WA(a.getBoundingClientRect(), l));
}
function $A(a, l, o) {
  const r = qp(a, o), { scroll: c } = l;
  return c && (En(r.x, c.offset.x), En(r.y, c.offset.y)), r;
}
const { schedule: Ia, cancel: Xp } = /* @__PURE__ */ sp(queueMicrotask, !1), ln = {
  x: !1,
  y: !1
};
function Qp() {
  return ln.x || ln.y;
}
function t2(a) {
  return a === "x" || a === "y" ? ln[a] ? null : (ln[a] = !0, () => {
    ln[a] = !1;
  }) : ln.x || ln.y ? null : (ln.x = ln.y = !0, () => {
    ln.x = ln.y = !1;
  });
}
function Zp(a, l) {
  const o = Bp(a), r = new AbortController(), c = {
    passive: !0,
    ...l,
    signal: r.signal
  };
  return [o, c, () => r.abort()];
}
function e2(a) {
  return !(a.pointerType === "touch" || Qp());
}
function n2(a, l, o = {}) {
  const [r, c, d] = Zp(a, o);
  return r.forEach((h) => {
    let m = !1, S = !1, p;
    const v = () => {
      h.removeEventListener("pointerleave", R);
    }, g = (V) => {
      p && (p(V), p = void 0), v();
    }, b = (V) => {
      m = !1, window.removeEventListener("pointerup", b), window.removeEventListener("pointercancel", b), S && (S = !1, g(V));
    }, _ = () => {
      m = !0, window.addEventListener("pointerup", b, c), window.addEventListener("pointercancel", b, c);
    }, R = (V) => {
      if (V.pointerType !== "touch") {
        if (m) {
          S = !0;
          return;
        }
        g(V);
      }
    }, B = (V) => {
      if (!e2(V))
        return;
      S = !1;
      const Q = l(h, V);
      typeof Q == "function" && (p = Q, h.addEventListener("pointerleave", R, c));
    };
    h.addEventListener("pointerenter", B, c), h.addEventListener("pointerdown", _, c);
  }), d;
}
const Kp = (a, l) => l ? a === l ? !0 : Kp(a, l.parentElement) : !1, xh = (a) => a.pointerType === "mouse" ? typeof a.button != "number" || a.button <= 0 : a.isPrimary !== !1, i2 = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function a2(a) {
  return i2.has(a.tagName) || a.isContentEditable === !0;
}
const l2 = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function u2(a) {
  return l2.has(a.tagName) || a.isContentEditable === !0;
}
const Ws = /* @__PURE__ */ new WeakSet();
function j0(a) {
  return (l) => {
    l.key === "Enter" && a(l);
  };
}
function Sf(a, l) {
  a.dispatchEvent(new PointerEvent("pointer" + l, { isPrimary: !0, bubbles: !0 }));
}
const s2 = (a, l) => {
  const o = a.currentTarget;
  if (!o)
    return;
  const r = j0(() => {
    if (Ws.has(o))
      return;
    Sf(o, "down");
    const c = j0(() => {
      Sf(o, "up");
    }), d = () => Sf(o, "cancel");
    o.addEventListener("keyup", c, l), o.addEventListener("blur", d, l);
  });
  o.addEventListener("keydown", r, l), o.addEventListener("blur", () => o.removeEventListener("keydown", r), l);
};
function Y0(a) {
  return xh(a) && !Qp();
}
const G0 = /* @__PURE__ */ new WeakSet();
function o2(a, l, o = {}) {
  const [r, c, d] = Zp(a, o), h = (m) => {
    const S = m.currentTarget;
    if (!Y0(m) || G0.has(m))
      return;
    Ws.add(S), o.stopPropagation && G0.add(m);
    const p = l(S, m), v = { ...c, capture: !0 }, g = (R, B) => {
      window.removeEventListener("pointerup", b, v), window.removeEventListener("pointercancel", _, v), Ws.has(S) && Ws.delete(S), Y0(R) && typeof p == "function" && p(R, { success: B });
    }, b = (R) => {
      g(R, S === window || S === document || o.useGlobalTarget || Kp(S, R.target));
    }, _ = (R) => {
      g(R, !1);
    };
    window.addEventListener("pointerup", b, v), window.addEventListener("pointercancel", _, v);
  };
  return r.forEach((m) => {
    (o.useGlobalTarget ? window : m).addEventListener("pointerdown", h, c), wp(m) && (m.addEventListener("focus", (p) => s2(p, c)), !a2(m) && !m.hasAttribute("tabindex") && (m.tabIndex = 0));
  }), d;
}
const Is = /* @__PURE__ */ new WeakMap();
let $s;
const Jp = (a, l, o) => (r, c) => c && c[0] ? c[0][a + "Size"] : Dh(r) && "getBBox" in r ? r.getBBox()[l] : r[o], r2 = /* @__PURE__ */ Jp("inline", "width", "offsetWidth"), c2 = /* @__PURE__ */ Jp("block", "height", "offsetHeight");
function f2({ target: a, borderBoxSize: l }) {
  Is.get(a)?.forEach((o) => {
    o(a, {
      get width() {
        return r2(a, l);
      },
      get height() {
        return c2(a, l);
      }
    });
  });
}
function h2(a) {
  a.forEach(f2);
}
function d2() {
  typeof ResizeObserver > "u" || ($s = new ResizeObserver(h2));
}
function m2(a, l) {
  $s || d2();
  const o = Bp(a);
  return o.forEach((r) => {
    let c = Is.get(r);
    c || (c = /* @__PURE__ */ new Set(), Is.set(r, c)), c.add(l), $s?.observe(r);
  }), () => {
    o.forEach((r) => {
      const c = Is.get(r);
      c?.delete(l), c?.size || $s?.unobserve(r);
    });
  };
}
const to = /* @__PURE__ */ new Set();
let Ja;
function y2() {
  Ja = () => {
    const a = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    to.forEach((l) => l(a));
  }, window.addEventListener("resize", Ja);
}
function g2(a) {
  return to.add(a), Ja || y2(), () => {
    to.delete(a), !to.size && typeof Ja == "function" && (window.removeEventListener("resize", Ja), Ja = void 0);
  };
}
function uu(a, l) {
  return typeof a == "function" ? g2(a) : m2(a, l);
}
function v2(a) {
  return Dh(a) && a.tagName === "svg";
}
function p2(...a) {
  const l = !Array.isArray(a[0]), o = l ? 0 : -1, r = a[0 + o], c = a[1 + o], d = a[2 + o], h = a[3 + o], m = hp(c, d, h);
  return l ? m(r) : m;
}
const q0 = (a) => typeof a == "number" ? a : parseFloat(a), X0 = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Pa = () => ({
  x: X0(),
  y: X0()
}), Q0 = () => ({ min: 0, max: 0 }), kt = () => ({
  x: Q0(),
  y: Q0()
}), S2 = /* @__PURE__ */ new WeakMap();
function So(a) {
  return a !== null && typeof a == "object" && typeof a.start == "function";
}
function su(a) {
  return typeof a == "string" || Array.isArray(a);
}
const Ch = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Z0 = ["initial", ...Ch];
function To(a) {
  if (So(a.animate))
    return !0;
  for (let l = 0; l < Z0.length; l++)
    if (su(a[Z0[l]]))
      return !0;
  return !1;
}
function Pp(a) {
  return !!(To(a) || a.variants);
}
function T2(a, l, o) {
  for (const r in l) {
    const c = l[r], d = o[r];
    if (he(c))
      a.addValue(r, c);
    else if (he(d))
      a.addValue(r, un(c, { owner: a }));
    else if (d !== c)
      if (a.hasValue(r)) {
        const h = a.getValue(r);
        h.liveStyle === !0 ? h.jump(c) : h.hasAnimated || h.set(c);
      } else {
        const h = a.getStaticValue(r);
        a.addValue(r, un(h !== void 0 ? h : c, { owner: a }));
      }
  }
  for (const r in o)
    l[r] === void 0 && a.removeValue(r);
  return l;
}
const ho = { current: null }, Oh = { current: !1 }, b2 = typeof window < "u";
function Fp() {
  if (Oh.current = !0, !!b2)
    if (window.matchMedia) {
      const a = window.matchMedia("(prefers-reduced-motion)"), l = () => ho.current = a.matches;
      a.addEventListener("change", l), l();
    } else
      ho.current = !1;
}
const K0 = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let mo = {};
function kp(a) {
  mo = a;
}
function E2() {
  return mo;
}
class A2 {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(l, o, r) {
    return {};
  }
  constructor({ parent: l, props: o, presenceContext: r, reducedMotionConfig: c, skipAnimations: d, blockInitialAnimation: h, visualState: m }, S = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = vh, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const _ = fe.now();
      this.renderScheduledAt < _ && (this.renderScheduledAt = _, bt.render(this.render, !1, !0));
    };
    const { latestValues: p, renderState: v } = m;
    this.latestValues = p, this.baseTarget = { ...p }, this.initialValues = o.initial ? { ...p } : {}, this.renderState = v, this.parent = l, this.props = o, this.presenceContext = r, this.depth = l ? l.depth + 1 : 0, this.reducedMotionConfig = c, this.skipAnimationsConfig = d, this.options = S, this.blockInitialAnimation = !!h, this.isControllingVariants = To(o), this.isVariantNode = Pp(o), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(l && l.current);
    const { willChange: g, ...b } = this.scrapeMotionValuesFromProps(o, {}, this);
    for (const _ in b) {
      const R = b[_];
      p[_] !== void 0 && he(R) && R.set(p[_]);
    }
  }
  mount(l) {
    if (this.hasBeenMounted)
      for (const o in this.initialValues)
        this.values.get(o)?.jump(this.initialValues[o]), this.latestValues[o] = this.initialValues[o];
    if (this.current = l, S2.set(l, this), this.projection && !this.projection.instance && this.projection.mount(l), this.isVariantNode && !this.isControllingVariants) {
      let o = this;
      do
        o = o.props.inherit !== !1 && o.parent;
      while (o && !o.isVariantNode);
      if (o) {
        const { variantChildren: r } = o;
        r.add(this), this.removeFromVariantTree = () => r.delete(this);
      }
    }
    this.values.forEach((o, r) => this.bindToMotionValue(r, o)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (Oh.current || Fp(), this.shouldReduceMotion = ho.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
  }
  unmount() {
    this.projection && this.projection.unmount(), sn(this.notifyUpdate), sn(this.render), this.valueSubscriptions.forEach((l) => l()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
    for (const l in this.events)
      this.events[l].clear();
    for (const l in this.features) {
      const o = this.features[l];
      o && (o.unmount(), o.isMounted = !1);
    }
    this.current = null;
  }
  addChild(l) {
    this.children.add(l), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(l);
  }
  removeChild(l) {
    this.children.delete(l), this.enteringChildren && this.enteringChildren.delete(l);
  }
  bindToMotionValue(l, o) {
    if (this.valueSubscriptions.has(l) && this.valueSubscriptions.get(l)(), o.accelerate && Xf.has(l) && this.current instanceof HTMLElement) {
      const { factory: h, keyframes: m, times: S, ease: p, duration: v } = o.accelerate, g = new Dp({
        element: this.current,
        name: l,
        keyframes: m,
        times: S,
        ease: p,
        duration: /* @__PURE__ */ ke(v)
      }), b = h(g);
      this.valueSubscriptions.set(l, () => {
        b(), g.cancel();
      });
      return;
    }
    const r = Ti.has(l);
    r && this.onBindTransform && this.onBindTransform();
    const c = o.on("change", (h) => {
      this.latestValues[l] = h, this.props.onUpdate && bt.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let d;
    typeof window < "u" && window.MotionCheckAppearSync && (d = window.MotionCheckAppearSync(this, l, o)), this.valueSubscriptions.set(l, () => {
      c(), d && d();
    });
  }
  sortNodePosition(l) {
    return !this.current || !l.current || !this.sortInstanceNodePosition || this.type !== l.type ? 0 : this.sortInstanceNodePosition(this.current, l.current);
  }
  updateFeatures() {
    let l = "animation";
    for (l in mo) {
      const o = mo[l];
      if (!o)
        continue;
      const { isEnabled: r, Feature: c } = o;
      if (!this.features[l] && c && r(this.props) && (this.features[l] = new c(this)), this.features[l]) {
        const d = this.features[l];
        d.isMounted ? d.update() : (d.mount(), d.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : kt();
  }
  getStaticValue(l) {
    return this.latestValues[l];
  }
  setStaticValue(l, o) {
    this.latestValues[l] = o;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(l, o) {
    (l.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = l, this.prevPresenceContext = this.presenceContext, this.presenceContext = o;
    for (let r = 0; r < K0.length; r++) {
      const c = K0[r];
      this.propEventSubscriptions[c] && (this.propEventSubscriptions[c](), delete this.propEventSubscriptions[c]);
      const d = "on" + c, h = l[d];
      h && (this.propEventSubscriptions[c] = this.on(c, h));
    }
    this.prevMotionValues = T2(this, this.scrapeMotionValuesFromProps(l, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(l) {
    return this.props.variants ? this.props.variants[l] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(l, o) {
    const r = this.values.get(l);
    if (o !== r) {
      r && this.removeValue(l), this.bindToMotionValue(l, o), this.values.set(l, o);
      const c = o.get();
      c !== void 0 && (this.latestValues[l] = c);
    }
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(l) {
    this.values.delete(l);
    const o = this.valueSubscriptions.get(l);
    o && (o(), this.valueSubscriptions.delete(l)), delete this.latestValues[l], this.removeValueFromRenderState(l, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(l) {
    return this.values.has(l);
  }
  getValue(l, o) {
    if (this.props.values && this.props.values[l])
      return this.props.values[l];
    let r = this.values.get(l);
    return r === void 0 && o !== void 0 && (r = un(o ?? this.getDefaultValue?.(l), {
      owner: this
    }), this.addValue(l, r)), r;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(l, o) {
    let r = this.latestValues[l] !== void 0 || !this.current ? this.latestValues[l] : this.getBaseTargetFromProps(this.props, l) ?? this.readValueFromInstance(this.current, l, this.options);
    return r != null && (typeof r == "string" && (nh(r) || ih(r)) ? r = parseFloat(r) : (
      /**
       * If the value as read isn't animatable (e.g. "none") but
       * the target is, derive an animatable none from the target.
       * A value is animatable if it's a number or contains a
       * number or color, which is cheaper to check than trying
       * every value type in turn.
       */
      typeof r != "number" && !je.test(r) && je.test(o) && (r = gh(l, o))
    ), this.setBaseTarget(l, he(r) ? r.get() : r)), he(r) ? r.get() : r;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(l, o) {
    this.baseTarget[l] = o;
  }
  on(l, o) {
    return this.events[l] || (this.events[l] = new uo()), this.events[l].add(o);
  }
  notify(l, ...o) {
    this.events[l] && this.events[l].notify(...o);
  }
  scheduleRenderMicrotask() {
    Ia.render(this.render);
  }
}
class Wp extends A2 {
  constructor() {
    super(...arguments), this.KeyframeResolver = XA;
  }
  sortInstanceNodePosition(l, o) {
    return l.compareDocumentPosition(o) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(l, o) {
    const r = l.style;
    return r ? r[o] : void 0;
  }
  removeValueFromRenderState(l, { vars: o, style: r }) {
    delete o[l], delete r[l];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: l } = this.props;
    he(l) && (this.childSubscription = l.on("change", (o) => {
      this.current && (this.current.textContent = `${o}`);
    }));
  }
}
class bi {
  constructor(l) {
    this.isMounted = !1, this.node = l;
  }
  update() {
  }
}
function Ip(a, { style: l, vars: o }, r, c) {
  const d = a.style;
  let h;
  for (h in l)
    d[h] = l[h];
  c?.applyProjectionStyles(d, r);
  for (h in o)
    d.setProperty(h, o[h]);
}
const ou = {};
function $p(a, { layout: l, layoutId: o }) {
  return Ti.has(a) || a.startsWith("origin") || (l || o !== void 0) && (!!ou[a] || a === "opacity");
}
function zh(a, l, o) {
  const r = a.style, c = l?.style, d = {};
  if (!r)
    return d;
  for (const h in r)
    (he(r[h]) || c && he(c[h]) || $p(h, a) || o?.getValue(h)?.liveStyle !== void 0) && (d[h] = r[h]);
  return d;
}
function D2(a) {
  return window.getComputedStyle(a);
}
class M2 extends Wp {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = Ip;
  }
  mount(l) {
    vo(!!l.style), super.mount(l);
  }
  readValueFromInstance(l, o) {
    if (Ti.has(o))
      return this.projection?.isProjecting ? lu(o) : JE(l, o);
    {
      const r = D2(l), c = ($v(o) ? r.getPropertyValue(o) : r[o]) || 0;
      return typeof c == "string" ? c.trim() : c;
    }
  }
  measureInstanceViewportBox(l, { transformPagePoint: o }) {
    return qp(l, o);
  }
  build(l, o, r) {
    Mh(l, o, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(l, o, r) {
    return zh(l, o, r);
  }
}
const t1 = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]), e1 = (a) => typeof a == "string" && a.toLowerCase() === "svg";
function x2(a, l, o, r) {
  Ip(a, l, void 0, r);
  for (const c in l.attrs)
    a.setAttribute(t1.has(c) ? c : Eh(c), l.attrs[c]);
}
function n1(a, l, o) {
  const r = zh(a, l, o);
  for (const c in a)
    if (he(a[c]) || he(l[c])) {
      const d = tl.indexOf(c) !== -1 ? "attr" + c.charAt(0).toUpperCase() + c.substring(1) : c;
      r[d] = a[c];
    }
  return r;
}
class C2 extends Wp {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = kt;
  }
  getBaseTargetFromProps(l, o) {
    return Ti.has(o) ? super.getBaseTargetFromProps(l, o) ?? lu(o) : l[o];
  }
  /**
   * An independent transform's origin is never read from the DOM, so it
   * starts from its latest or default value and renders on mount.
   */
  getDefaultValue(l) {
    return Ti.has(l) ? this.latestValues[l] ?? lu(l) : void 0;
  }
  readValueFromInstance(l, o) {
    if (Ti.has(o)) {
      const r = gp(o);
      return r && r.default || 0;
    }
    if (Hp.includes(o)) {
      const c = getComputedStyle(l)[o];
      if (typeof c == "string" && c)
        return c.trim();
    }
    return o = t1.has(o) ? o : Eh(o), l.getAttribute(o);
  }
  scrapeMotionValuesFromProps(l, o, r) {
    return n1(l, o, r);
  }
  build(l, o, r) {
    Lp(l, o, this.isSVGTag, r.transformTemplate, r.style);
  }
  renderInstance(l, o, r, c) {
    x2(l, o, r, c);
  }
  mount(l) {
    this.isSVGTag = e1(l.tagName), super.mount(l);
  }
}
function i1(a, l) {
  if (!Array.isArray(l))
    return !1;
  const o = l.length;
  if (o !== a.length)
    return !1;
  for (let r = 0; r < o; r++)
    if (l[r] !== a[r])
      return !1;
  return !0;
}
const O2 = [...Ch].reverse();
function z2(a) {
  let l = (m) => Promise.all(m.map(({ animation: S, options: p }) => BA(a, S, p))), o = J0(), r = !0, c = !1;
  function d(m) {
    const { props: S, parent: p, manuallyAnimateOnMount: v } = a, g = r || c, b = [], _ = /* @__PURE__ */ new Set();
    let R = {}, B = 1 / 0, V = a;
    do
      V = V.props.inherit !== !1 && V.parent;
    while (V && !V.isControllingVariants);
    if (O2.forEach((Y, Z) => {
      const q = o[Y], at = S[Y], ot = V && V.props[Y], w = at !== void 0 ? at : su(ot) || ot === !1 ? ot : void 0, L = su(w), pt = Y === m ? q.isActive : null;
      pt === !1 && (B = Z);
      const rt = L && at === void 0 && !(g && v);
      if (q.protectedKeys = { ...R }, !q.isActive && pt === null || !w && !q.prevProp || So(w) || typeof w == "boolean")
        return;
      if (Y === "exit" && q.isActive && pt !== !0) {
        R = {
          ...R,
          ...q.prevResolvedValues
        };
        return;
      }
      const Yt = R2(q.prevProp, w);
      let Ht = Yt || L && (pt && !rt || Z > B), Lt = !1;
      const Se = Array.isArray(w) ? w : [w];
      let wt = {};
      if (pt !== !1)
        for (const K of Se) {
          const { transition: k, transitionEnd: mt, ...yt } = Wi(a, K, Rp(a, Y)) || {};
          wt = {
            ...wt,
            ...yt,
            ...mt
          };
        }
      const { prevResolvedValues: G } = q;
      for (const K in { ...G, ...wt }) {
        if (K in R)
          continue;
        const k = wt[K], mt = G[K], yt = Array.isArray(k) && Array.isArray(mt) ? !i1(k, mt) || Yt : k !== mt;
        if (yt && k == null)
          _.add(K);
        else if (yt || k !== void 0 && _.has(K)) {
          Ht = !0, _.delete(K) && (Lt = !0), q.needsAnimating[K] = !0;
          const Te = a.getValue(K);
          Te && (Te.liveStyle = !1);
        } else
          q.protectedKeys[K] = !0;
      }
      if (q.prevProp = w, q.prevResolvedValues = wt, q.isActive && (R = { ...R, ...wt }), Ht && (!(rt && Yt) || Lt))
        for (const K of Se) {
          const k = { type: Y };
          if (typeof K == "string" && g && v && p?.enteringChildren) {
            const mt = Wi(p, K)?.transition?.delayChildren;
            k.delay = xp(p.enteringChildren, a, mt);
          }
          b.push({ animation: K, options: k });
        }
    }), _.size) {
      const { initial: Y } = S, Z = {}, q = typeof Y != "boolean" && Wi(a, Array.isArray(Y) ? Y[0] : Y, a.presenceContext?.custom);
      q && q.transition && (Z.transition = q.transition), _.forEach((at) => {
        const ot = a.getValue(at);
        ot && (ot.liveStyle = !0);
        const w = q && !Array.isArray(Y) ? q[at] : void 0, L = a.getBaseTargetFromProps(S, at);
        Z[at] = (w !== void 0 ? w : L !== void 0 && !he(L) ? L : a.initialValues[at] === void 0 ? a.baseTarget[at] : void 0) ?? null;
      }), b.push({ animation: Z });
    }
    const Q = g && a.blockInitialAnimation || r && !v && (S.initial === !1 || S.initial === S.animate);
    return r = c = !1, !Q && b.length ? l(b) : Promise.resolve();
  }
  function h(m, S) {
    if (o[m].isActive === S)
      return Promise.resolve();
    a.variantChildren?.forEach((v) => v.animationState?.setActive(m, S)), o[m].isActive = S;
    const p = d(m);
    for (const v in o)
      o[v].protectedKeys = {};
    return p;
  }
  return {
    animateChanges: d,
    setActive: h,
    /**
     * Allows tests to inject a mocked animate function.
     * @internal
     */
    setAnimateFunction: (m) => {
      l = m(a);
    },
    getState: () => o,
    reset: () => {
      o = J0(), c = !0;
    }
  };
}
function R2(a, l) {
  return typeof l == "string" ? l !== a : Array.isArray(l) ? !i1(l, a) : !1;
}
function J0() {
  const a = {};
  for (const l of Ch)
    a[l] = {
      isActive: l === "animate",
      protectedKeys: {},
      needsAnimating: {},
      prevResolvedValues: {}
    };
  return a;
}
function Ff(a, l) {
  a.min = l.min, a.max = l.max;
}
function an(a, l) {
  Ff(a.x, l.x), Ff(a.y, l.y);
}
function P0(a, l) {
  a.translate = l.translate, a.scale = l.scale, a.originPoint = l.originPoint, a.origin = l.origin;
}
const a1 = 1e-4, _2 = 1 - a1, N2 = 1 + a1, l1 = 0.01, V2 = 0 - l1, U2 = 0 + l1;
function pe(a) {
  return a.max - a.min;
}
function w2(a, l, o) {
  return Math.abs(a - l) <= o;
}
function F0(a, l, o, r = 0.5) {
  a.origin = r, a.originPoint = zt(l.min, l.max, a.origin), a.scale = pe(o) / pe(l), a.translate = zt(o.min, o.max, a.origin) - a.originPoint, (a.scale >= _2 && a.scale <= N2 || isNaN(a.scale)) && (a.scale = 1), (a.translate >= V2 && a.translate <= U2 || isNaN(a.translate)) && (a.translate = 0);
}
function eu(a, l, o, r) {
  F0(a.x, l.x, o.x, r ? r.originX : void 0), F0(a.y, l.y, o.y, r ? r.originY : void 0);
}
function k0(a, l, o, r = 0) {
  const c = r ? zt(o.min, o.max, r) : o.min;
  a.min = c + l.min, a.max = a.min + pe(l);
}
function B2(a, l, o, r) {
  k0(a.x, l.x, o.x, r?.x), k0(a.y, l.y, o.y, r?.y);
}
function W0(a, l, o, r = 0) {
  const c = r ? zt(o.min, o.max, r) : o.min;
  a.min = l.min - c, a.max = a.min + pe(l);
}
function yo(a, l, o, r) {
  W0(a.x, l.x, o.x, r?.x), W0(a.y, l.y, o.y, r?.y);
}
function I0(a, l, o, r, c) {
  return a -= l, a = fo(a, 1 / o, r), c !== void 0 && (a = fo(a, 1 / c, r)), a;
}
function H2(a, l = 0, o = 1, r = 0.5, c, d = a, h = a) {
  if (Dn.test(l) && (l = parseFloat(l), l = zt(h.min, h.max, l / 100) - h.min), typeof l != "number")
    return;
  let m = zt(d.min, d.max, r);
  a === d && (m -= l), a.min = I0(a.min, l, o, m, c), a.max = I0(a.max, l, o, m, c);
}
function $0(a, l, [o, r, c], d, h) {
  H2(a, l[o], l[r], l[c], l.scale, d, h);
}
const L2 = ["x", "scaleX", "originX"], j2 = ["y", "scaleY", "originY"];
function tv(a, l, o, r) {
  $0(a.x, l, L2, o ? o.x : void 0, r ? r.x : void 0), $0(a.y, l, j2, o ? o.y : void 0, r ? r.y : void 0);
}
function ev(a) {
  return a.translate === 0 && a.scale === 1;
}
function u1(a) {
  return ev(a.x) && ev(a.y);
}
function nv(a, l) {
  return a.min === l.min && a.max === l.max;
}
function Y2(a, l) {
  return nv(a.x, l.x) && nv(a.y, l.y);
}
function iv(a, l) {
  return Math.round(a.min) === Math.round(l.min) && Math.round(a.max) === Math.round(l.max);
}
function s1(a, l) {
  return iv(a.x, l.x) && iv(a.y, l.y);
}
function av(a) {
  return pe(a.x) / pe(a.y);
}
function lv(a, l) {
  return a.translate === l.translate && a.scale === l.scale && a.originPoint === l.originPoint;
}
function bn(a) {
  return [a("x"), a("y")];
}
function uv(a, l) {
  return l.max === l.min ? 0 : a / (l.max - l.min) * 100;
}
const Wl = {
  correct: (a, l) => {
    if (!l.target)
      return a;
    if (typeof a == "string")
      if (P.test(a))
        a = parseFloat(a);
      else
        return a;
    const o = uv(a, l.target.x), r = uv(a, l.target.y);
    return `${o}% ${r}%`;
  }
}, G2 = {
  correct: (a, { treeScale: l, projectionDelta: o }) => {
    const r = a, c = je.parse(a);
    if (c.length > 5)
      return r;
    const d = je.createTransformer(a), h = typeof c[0] != "number" ? 1 : 0, m = o.x.scale * l.x, S = o.y.scale * l.y;
    c[0 + h] /= m, c[1 + h] /= S;
    const p = zt(m, S, 0.5);
    return typeof c[2 + h] == "number" && (c[2 + h] /= p), typeof c[3 + h] == "number" && (c[3 + h] /= p), d(c);
  }
};
function q2(a, l, o) {
  let r = "";
  const c = a.x.translate / l.x, d = a.y.translate / l.y, h = o?.z || 0;
  if ((c || d || h) && (r = `translate3d(${c}px, ${d}px, ${h}px) `), (l.x !== 1 || l.y !== 1) && (r += `scale(${1 / l.x}, ${1 / l.y}) `), o) {
    const { transformPerspective: p, rotate: v, pathRotation: g, rotateX: b, rotateY: _, skewX: R, skewY: B } = o;
    p && (r = `perspective(${p}px) ${r}`), v && (r += `rotate(${v}deg) `), g && (r += `rotate(${g}deg) `), b && (r += `rotateX(${b}deg) `), _ && (r += `rotateY(${_}deg) `), R && (r += `skewX(${R}deg) `), B && (r += `skewY(${B}deg) `);
  }
  const m = a.x.scale * l.x, S = a.y.scale * l.y;
  return (m !== 1 || S !== 1) && (r += `scale(${m}, ${S})`), r || "none";
}
const X2 = Ah.length, sv = (a) => typeof a == "number" || P.test(a);
function Q2(a, l, o, r, c, d) {
  c ? (a.opacity = zt(0, o.opacity ?? 1, Z2(r)), a.opacityExit = zt(l.opacity ?? 1, 0, K2(r))) : d && (a.opacity = zt(l.opacity ?? 1, o.opacity ?? 1, r));
  for (let h = 0; h < X2; h++) {
    const m = Ah[h];
    let S = ov(l, m), p = ov(o, m);
    if (S === void 0 && p === void 0)
      continue;
    S || (S = 0), p || (p = 0), S === 0 || p === 0 || sv(S) === sv(p) ? (a[m] = Math.max(zt(q0(S), q0(p), r), 0), (Dn.test(p) || Dn.test(S)) && (a[m] += "%")) : a[m] = p;
  }
  (l.rotate || o.rotate) && (a.rotate = zt(l.rotate || 0, o.rotate || 0, r));
}
function ov(a, l) {
  return a[l] !== void 0 ? a[l] : a.borderRadius;
}
const Z2 = /* @__PURE__ */ o1(0, 0.5, Fv), K2 = /* @__PURE__ */ o1(0.5, 0.95, Le);
function o1(a, l, o) {
  return (r) => r < a ? 0 : r > l ? 1 : o(/* @__PURE__ */ Ii(a, l, r));
}
function J2(a, l, o) {
  const r = he(a) ? a : un(a);
  return r.start(bh("", r, l, o)), r.animation;
}
function ru(a, l, o, r = { passive: !0 }) {
  return a.addEventListener(l, o, r), () => a.removeEventListener(l, o, r);
}
const P2 = (a, l) => a.depth - l.depth;
class F2 {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(l) {
    eh(this.children, l), this.isDirty = !0;
  }
  remove(l) {
    lo(this.children, l), this.isDirty = !0;
  }
  forEach(l) {
    this.isDirty && this.children.sort(P2), this.isDirty = !1, this.children.forEach(l);
  }
}
function k2(a, l) {
  const o = fe.now(), r = ({ timestamp: c }) => {
    const d = c - o;
    d >= l && (sn(r), a(d - l));
  };
  return bt.setup(r, !0), () => sn(r);
}
function eo(a) {
  return he(a) ? a.get() : a;
}
class W2 {
  constructor() {
    this.members = [];
  }
  add(l) {
    eh(this.members, l);
    for (let o = this.members.length - 1; o >= 0; o--) {
      const r = this.members[o];
      if (r === l || r === this.lead || r === this.prevLead)
        continue;
      const c = r.instance;
      (!c || c.isConnected === !1) && !r.snapshot && (lo(this.members, r), r.unmount());
    }
    l.scheduleRender();
  }
  remove(l) {
    if (lo(this.members, l), l === this.prevLead && (this.prevLead = void 0), l === this.lead) {
      const o = this.members[this.members.length - 1];
      o && this.promote(o);
    }
  }
  relegate(l) {
    for (let o = this.members.indexOf(l) - 1; o >= 0; o--) {
      const r = this.members[o];
      if (r.isPresent !== !1 && r.instance?.isConnected !== !1)
        return this.promote(r), !0;
    }
    return !1;
  }
  promote(l, o) {
    const r = this.lead;
    if (l !== r && (this.prevLead = r, this.lead = l, l.show(), r)) {
      r.updateSnapshot(), l.scheduleRender();
      const { layoutDependency: c } = r.options, { layoutDependency: d } = l.options;
      (c === void 0 || c !== d) && (l.resumeFrom = r, o && (r.preserveOpacity = !0), r.snapshot && (l.snapshot = r.snapshot, l.snapshot.latestValues = r.animationValues || r.latestValues), l.root?.isUpdating && (l.isLayoutDirty = !0)), l.options.crossfade === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((l) => {
      l.options.onExitComplete?.(), l.resumingFrom?.options.onExitComplete?.();
    });
  }
  scheduleRender() {
    this.members.forEach((l) => l.instance && l.scheduleRender(!1));
  }
  removeLeadSnapshot() {
    this.lead?.snapshot && (this.lead.snapshot = void 0);
  }
}
const I2 = {
  borderRadius: {
    ...Wl,
    applyTo: [...Ah]
  },
  borderTopLeftRadius: Wl,
  borderTopRightRadius: Wl,
  borderBottomLeftRadius: Wl,
  borderBottomRightRadius: Wl,
  boxShadow: G2
}, no = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
Object.assign(ou, {
  ...I2,
  ...ou
});
const Tf = ["", "X", "Y", "Z"], $2 = 1e3;
let t3 = 0;
function bf(a, l, o, r) {
  const { latestValues: c } = l;
  c[a] && (o[a] = c[a], l.setStaticValue(a, 0), r && (r[a] = 0));
}
function r1(a) {
  if (a.hasCheckedOptimisedAppear = !0, a.root === a)
    return;
  const { visualElement: l } = a.options;
  if (!l)
    return;
  const o = Vp(l);
  if (window.MotionHasOptimisedAnimation(o, "transform")) {
    const { layout: c, layoutId: d } = a.options;
    window.MotionCancelOptimisedAnimation(o, "transform", bt, !(c || d));
  }
  const { parent: r } = a;
  r && !r.hasCheckedOptimisedAppear && r1(r);
}
function c1({ attachResizeListener: a, defaultParent: l, measureScroll: o, checkIsScrollRoot: r, resetTransform: c }) {
  return class {
    constructor(h = {}, m = l?.()) {
      this.id = t3++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(i3), this.nodes.forEach(c3), this.nodes.forEach(f3), this.nodes.forEach(a3);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = h, this.root = m ? m.root || m : this, this.path = m ? [...m.path, m] : [], this.parent = m, this.depth = m ? m.depth + 1 : 0;
      for (let S = 0; S < this.path.length; S++)
        this.path[S].shouldResetTransform = !0;
      this.root === this && (this.nodes = new F2());
    }
    addEventListener(h, m) {
      return this.eventHandlers.has(h) || this.eventHandlers.set(h, new uo()), this.eventHandlers.get(h).add(m);
    }
    notifyListeners(h, ...m) {
      const S = this.eventHandlers.get(h);
      S && S.notify(...m);
    }
    hasListeners(h) {
      return this.eventHandlers.has(h);
    }
    /**
     * Lifecycles
     */
    mount(h) {
      if (this.instance)
        return;
      this.isSVG = Dh(h) && !v2(h), this.instance = h;
      const { layoutId: m, layout: S, visualElement: p } = this.options;
      if (p && !p.current && p.mount(h), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (S || m) && (this.isLayoutDirty = !0), a) {
        let v, g = 0;
        const b = () => this.root.updateBlockedByResize = !1;
        bt.read(() => {
          g = window.innerWidth;
        }), a(h, () => {
          const _ = window.innerWidth;
          _ !== g && (g = _, this.root.updateBlockedByResize = !0, v && v(), v = k2(b, 250), no.hasAnimatedSinceResize && (no.hasAnimatedSinceResize = !1, this.nodes.forEach(fv)));
        });
      }
      m && this.root.registerSharedNode(m, this), this.options.animate !== !1 && p && (m || S) && this.addEventListener("didUpdate", ({ delta: v, hasLayoutChanged: g, hasRelativeLayoutChanged: b, layout: _ }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const R = this.options.transition || p.getDefaultTransition() || g3, { onLayoutAnimationStart: B, onLayoutAnimationComplete: V } = p.getProps(), Q = !this.targetLayout || !s1(this.targetLayout, _), Y = !g && b;
        if (this.options.layoutRoot || this.resumeFrom || Y || g && (Q || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const Z = {
            ...Th(R, "layout"),
            onPlay: B,
            onComplete: V
          };
          (p.shouldReduceMotion || this.options.layoutRoot) && (Z.delay = 0, Z.type = !1), this.startAnimation(Z), this.setAnimationOrigin(v, Y, Z.path);
        } else
          g || fv(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = _;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const h = this.getStack();
      h && h.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), sn(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(h3), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: h } = this.options;
      return h && h.getProps().transformTemplate;
    }
    willUpdate(h = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && r1(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let v = 0; v < this.path.length; v++) {
        const g = this.path[v];
        g.shouldResetTransform = !0, (typeof g.latestValues.x == "string" || typeof g.latestValues.y == "string") && (g.isLayoutDirty = !0), g.updateScroll("snapshot"), g.options.layoutRoot && g.willUpdate(!1);
      }
      const { layoutId: m, layout: S } = this.options;
      if (m === void 0 && !S)
        return;
      const p = this.getTransformTemplate();
      this.prevTransformTemplateValue = p ? p(this.latestValues, "") : void 0, this.updateSnapshot(), h && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        const S = this.updateBlockedByResize;
        this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), S && this.nodes.forEach(u3), this.nodes.forEach(rv);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(cv);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(s3), this.nodes.forEach(o3), this.nodes.forEach(r3), this.nodes.forEach(e3), this.nodes.forEach(n3)) : this.nodes.forEach(cv), this.clearAllSnapshots();
      const m = fe.now();
      Pt.delta = Mn(0, 1e3 / 60, m - Pt.timestamp), Pt.timestamp = m, Pt.isProcessing = !0, mf.update.process(Pt), mf.preRender.process(Pt), mf.render.process(Pt), Pt.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Ia.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(l3), this.sharedNodes.forEach(d3);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, bt.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      bt.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !pe(this.snapshot.measuredBox.x) && !pe(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let S = 0; S < this.path.length; S++)
          this.path[S].updateScroll();
      const h = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected || (this.layoutCorrected = kt()), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: m } = this.options;
      m && m.notify("LayoutMeasure", this.layout.layoutBox, h ? h.layoutBox : void 0);
    }
    updateScroll(h = "measure") {
      let m = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === h && (m = !1), m && this.instance) {
        const S = r(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: h,
          isRoot: S,
          offset: o(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : S
        };
      }
    }
    resetTransform() {
      if (!c)
        return;
      const h = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, m = this.projectionDelta && !u1(this.projectionDelta), S = this.getTransformTemplate(), p = S ? S(this.latestValues, "") : void 0, v = p !== this.prevTransformTemplateValue;
      h && this.instance && (m || Ki(this.latestValues) || v) && (c(this.instance, p), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(h = !0) {
      const m = this.measurePageBox();
      let S = this.removeElementScroll(m);
      return h && (S = this.removeTransform(S)), v3(S), {
        animationId: this.root.animationId,
        measuredBox: m,
        layoutBox: S,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement: h } = this.options;
      if (!h)
        return kt();
      const m = h.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(p3))) {
        const { scroll: p } = this.root;
        p && (En(m.x, p.offset.x), En(m.y, p.offset.y));
      }
      return m;
    }
    removeElementScroll(h) {
      const m = kt();
      if (an(m, h), this.scroll?.wasRoot)
        return m;
      for (let S = 0; S < this.path.length; S++) {
        const p = this.path[S], { scroll: v, options: g } = p;
        p !== this.root && v && g.layoutScroll && (v.wasRoot && an(m, h), En(m.x, v.offset.x), En(m.y, v.offset.y));
      }
      return m;
    }
    applyTransform(h, m = !1, S) {
      const p = S || kt();
      an(p, h);
      for (let v = 0; v < this.path.length; v++) {
        const g = this.path[v];
        !m && g.options.layoutScroll && g.scroll && g !== g.root && (En(p.x, -g.scroll.offset.x), En(p.y, -g.scroll.offset.y)), Ki(g.latestValues) && ks(p, g.latestValues, g.layout?.layoutBox);
      }
      return Ki(this.latestValues) && ks(p, this.latestValues, this.layout?.layoutBox), p;
    }
    removeTransform(h) {
      const m = kt();
      an(m, h);
      for (let S = 0; S < this.path.length; S++) {
        const p = this.path[S];
        if (!Ki(p.latestValues))
          continue;
        let v;
        p.instance && (Jf(p.latestValues) && p.updateSnapshot(), v = kt(), an(v, p.measurePageBox())), tv(m, p.latestValues, p.snapshot?.layoutBox, v);
      }
      return Ki(this.latestValues) && tv(m, this.latestValues), m;
    }
    setTargetDelta(h) {
      this.targetDelta = h, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(h) {
      this.options = {
        ...this.options,
        ...h,
        crossfade: h.crossfade !== void 0 ? h.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== Pt.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(h = !1) {
      const m = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = m.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = m.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = m.isSharedProjectionDirty);
      const S = !!this.resumingFrom || this !== m;
      if (!(h || S && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: v, layoutId: g } = this.options;
      if (!this.layout || !(v || g))
        return;
      this.resolvedRelativeTargetAt = Pt.timestamp;
      const b = this.getClosestProjectingParent();
      !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && b && b.layout ? this.createRelativeTarget(b, this.layout.layoutBox, b.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = kt(), this.targetWithTransforms = kt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), B2(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : an(this.target, this.layout.layoutBox), Gp(this.target, this.targetDelta)) : an(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && b && !!b.resumingFrom == !!this.resumingFrom && !b.options.layoutScroll && b.target && this.animationProgress !== 1 ? this.createRelativeTarget(b, this.target, b.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Jf(this.parent.latestValues) || Yp(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(h, m, S) {
      this.relativeParent = h, this.forceRelativeParentToResolveTarget(), this.relativeTarget = kt(), this.relativeTargetOrigin = kt(), yo(this.relativeTargetOrigin, m, S, this.options.layoutAnchor || void 0), an(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const h = this.getLead(), m = !!this.resumingFrom || this !== h;
      let S = !0;
      if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (S = !1), m && (this.isSharedProjectionDirty || this.isTransformDirty) && (S = !1), this.resolvedRelativeTargetAt === Pt.timestamp && (S = !1), S)
        return;
      const { layout: p, layoutId: v } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(p || v))
        return;
      an(this.layoutCorrected, this.layout.layoutBox);
      const g = this.treeScale.x, b = this.treeScale.y;
      IA(this.layoutCorrected, this.treeScale, this.path, m), h.layout && !h.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (h.target = h.layout.layoutBox, h.targetWithTransforms = kt());
      const { target: _ } = h;
      if (!_) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (P0(this.prevProjectionDelta.x, this.projectionDelta.x), P0(this.prevProjectionDelta.y, this.projectionDelta.y)), eu(this.projectionDelta, this.layoutCorrected, _, this.latestValues), (this.treeScale.x !== g || this.treeScale.y !== b || !lv(this.projectionDelta.x, this.prevProjectionDelta.x) || !lv(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", _));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(h = !0) {
      if (this.options.visualElement?.scheduleRender(), h) {
        const m = this.getStack();
        m && m.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Pa(), this.projectionDelta = Pa(), this.projectionDeltaWithTransform = Pa();
    }
    setAnimationOrigin(h, m = !1, S) {
      const p = this.snapshot, v = p ? p.latestValues : {}, g = { ...this.latestValues }, b = Pa();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !m;
      const _ = kt(), R = p ? p.source : void 0, B = this.layout ? this.layout.source : void 0, V = R !== B, Q = this.getStack(), Y = !Q || Q.members.length <= 1, Z = !!(V && !Y && this.options.crossfade === !0 && !this.path.some(y3));
      this.animationProgress = 0;
      let q;
      const at = S?.interpolateProjection(h);
      this.mixTargetDelta = (ot) => {
        const w = ot / 1e3, L = at?.(w);
        L ? (b.x.translate = L.x, b.x.scale = zt(h.x.scale, 1, w), b.x.origin = h.x.origin, b.x.originPoint = h.x.originPoint, b.y.translate = L.y, b.y.scale = zt(h.y.scale, 1, w), b.y.origin = h.y.origin, b.y.originPoint = h.y.originPoint) : (hv(b.x, h.x, w), hv(b.y, h.y, w)), this.setTargetDelta(b), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (yo(_, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), m3(this.relativeTarget, this.relativeTargetOrigin, _, w), q && Y2(this.relativeTarget, q) && (this.isProjectionDirty = !1), q || (q = kt()), an(q, this.relativeTarget)), V && (this.animationValues = g, Q2(g, v, this.latestValues, w, Z, Y)), L && L.rotate !== void 0 && (this.animationValues || (this.animationValues = g), this.animationValues.pathRotation = L.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = w;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(h) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (sn(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = bt.update(() => {
        no.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = un(0)), this.motionValue.jump(0, !1), this.currentAnimation = J2(this.motionValue, [0, 1e3], {
          ...h,
          velocity: 0,
          isSync: !0,
          onUpdate: (m) => {
            this.mixTargetDelta(m), h.onUpdate && h.onUpdate(m);
          },
          onComplete: () => {
            h.onComplete && h.onComplete(), this.completeAnimation();
          }
        }), BE(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const h = this.getStack();
      h && h.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta($2), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const h = this.getLead(), { targetWithTransforms: m, layout: S, latestValues: p } = h;
      let { target: v } = h;
      if (!(!m || !v || !S)) {
        if (this !== h && this.layout && S && f1(this.options.animationType, this.layout.layoutBox, S.layoutBox)) {
          v = this.target || kt();
          const g = pe(this.layout.layoutBox.x);
          v.x.min = h.target.x.min, v.x.max = v.x.min + g;
          const b = pe(this.layout.layoutBox.y);
          v.y.min = h.target.y.min, v.y.max = v.y.min + b;
        }
        an(m, v), ks(m, p), eu(this.projectionDeltaWithTransform, this.layoutCorrected, m, p);
      }
    }
    registerSharedNode(h, m) {
      this.sharedNodes.has(h) || this.sharedNodes.set(h, new W2()), this.sharedNodes.get(h).add(m);
      const p = m.options.initialPromotionConfig;
      m.promote({
        transition: p ? p.transition : void 0,
        preserveFollowOpacity: p && p.shouldPreserveFollowOpacity ? p.shouldPreserveFollowOpacity(m) : void 0
      });
    }
    isLead() {
      const h = this.getStack();
      return h ? h.lead === this : !0;
    }
    getLead() {
      const { layoutId: h } = this.options;
      return h ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: h } = this.options;
      return h ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: h } = this.options;
      if (h)
        return this.root.sharedNodes.get(h);
    }
    promote({ needsReset: h, transition: m, preserveFollowOpacity: S } = {}) {
      const p = this.getStack();
      p && p.promote(this, S), h && (this.projectionDelta = void 0, this.needsReset = !0), m && this.setOptions({ transition: m });
    }
    relegate() {
      const h = this.getStack();
      return h ? h.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: h } = this.options;
      if (!h)
        return;
      let m = !1;
      const { latestValues: S } = h;
      if ((S.z || S.rotate || S.rotateX || S.rotateY || S.rotateZ || S.skewX || S.skewY) && (m = !0), !m)
        return;
      const p = {};
      S.z && bf("z", h, p, this.animationValues);
      for (let v = 0; v < Tf.length; v++)
        bf(`rotate${Tf[v]}`, h, p, this.animationValues), bf(`skew${Tf[v]}`, h, p, this.animationValues);
      h.render();
      for (const v in p)
        h.setStaticValue(v, p[v]), this.animationValues && (this.animationValues[v] = p[v]);
      h.scheduleRender();
    }
    applyProjectionStyles(h, m) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        h.visibility = "hidden";
        return;
      }
      const S = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, h.visibility = "", h.opacity = "", h.pointerEvents = eo(m?.pointerEvents) || "", h.transform = S ? S(this.latestValues, "") : "none";
        return;
      }
      const p = this.getLead();
      if (!this.projectionDelta || !this.layout || !p.target) {
        this.options.layoutId && (h.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, h.pointerEvents = eo(m?.pointerEvents) || ""), this.hasProjected && !Ki(this.latestValues) && (h.transform = S ? S({}, "") : "none", this.hasProjected = !1);
        return;
      }
      h.visibility = "";
      const v = p.animationValues || p.latestValues;
      this.applyTransformsToTarget();
      let g = q2(this.projectionDeltaWithTransform, this.treeScale, v);
      S && (g = S(v, g)), h.transform = g;
      const { x: b, y: _ } = this.projectionDelta;
      h.transformOrigin = `${b.origin * 100}% ${_.origin * 100}% 0`, p.animationValues ? h.opacity = p === this ? v.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : v.opacityExit : h.opacity = p === this ? v.opacity !== void 0 ? v.opacity : "" : v.opacityExit !== void 0 ? v.opacityExit : 0;
      for (const R in ou) {
        if (v[R] === void 0)
          continue;
        const { correct: B, applyTo: V, isCSSVariable: Q } = ou[R], Y = g === "none" ? v[R] : B(v[R], p);
        if (V) {
          const Z = V.length;
          for (let q = 0; q < Z; q++)
            h[V[q]] = Y;
        } else
          Q ? this.options.visualElement.renderState.vars[R] = Y : h[R] = Y;
      }
      this.options.layoutId && (h.pointerEvents = p === this ? eo(m?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((h) => h.currentAnimation?.stop()), this.root.nodes.forEach(rv), this.root.sharedNodes.clear();
    }
  };
}
function e3(a) {
  a.updateLayout();
}
function n3(a) {
  const l = a.resumeFrom?.snapshot || a.snapshot;
  if (a.isLead() && a.layout && l && a.hasListeners("didUpdate")) {
    const { layoutBox: o, measuredBox: r } = a.layout, { animationType: c } = a.options, d = l.source !== a.layout.source;
    if (c === "size")
      bn((v) => {
        const g = d ? l.measuredBox[v] : l.layoutBox[v], b = pe(g);
        g.min = o[v].min, g.max = g.min + b;
      });
    else if (c === "x" || c === "y") {
      const v = c === "x" ? "y" : "x";
      Ff(d ? l.measuredBox[v] : l.layoutBox[v], o[v]);
    } else f1(c, l.layoutBox, o) && bn((v) => {
      const g = d ? l.measuredBox[v] : l.layoutBox[v], b = pe(o[v]);
      g.max = g.min + b, a.relativeTarget && !a.currentAnimation && (a.isProjectionDirty = !0, a.relativeTarget[v].max = a.relativeTarget[v].min + b);
    });
    const h = Pa();
    eu(h, o, l.layoutBox);
    const m = Pa();
    d ? eu(m, a.applyTransform(r, !0), l.measuredBox) : eu(m, o, l.layoutBox);
    const S = !u1(h);
    let p = !1;
    if (!a.resumeFrom) {
      const v = a.getClosestProjectingParent();
      if (v && !v.resumeFrom) {
        const { snapshot: g, layout: b } = v;
        if (g && b) {
          const _ = a.options.layoutAnchor || void 0, R = kt();
          yo(R, l.layoutBox, g.layoutBox, _);
          const B = kt();
          yo(B, o, b.layoutBox, _), s1(R, B) || (p = !0), v.options.layoutRoot && (a.relativeTarget = B, a.relativeTargetOrigin = R, a.relativeParent = v);
        }
      }
    }
    a.notifyListeners("didUpdate", {
      layout: o,
      snapshot: l,
      delta: m,
      layoutDelta: h,
      hasLayoutChanged: S,
      hasRelativeLayoutChanged: p
    });
  } else if (a.isLead()) {
    const { onExitComplete: o } = a.options;
    o && o();
  }
  a.options.transition = void 0;
}
function i3(a) {
  a.parent && (a.isProjecting() || (a.isProjectionDirty = a.parent.isProjectionDirty), a.isSharedProjectionDirty || (a.isSharedProjectionDirty = !!(a.isProjectionDirty || a.parent.isProjectionDirty || a.parent.isSharedProjectionDirty)), a.isTransformDirty || (a.isTransformDirty = a.parent.isTransformDirty));
}
function a3(a) {
  a.isProjectionDirty = a.isSharedProjectionDirty = a.isTransformDirty = !1;
}
function l3(a) {
  a.clearSnapshot();
}
function rv(a) {
  a.clearMeasurements();
}
function u3(a) {
  a.isLayoutDirty = !0, a.updateLayout();
}
function cv(a) {
  a.isLayoutDirty = !1;
}
function s3(a) {
  a.isAnimationBlocked && a.layout && !a.isLayoutDirty && (a.snapshot = a.layout, a.isLayoutDirty = !0);
}
function o3(a) {
  a.relativeTarget && a.relativeParent?.isLayoutDirty && (a.currentAnimation ? a.isLayoutDirty = !0 : (a.targetDelta = void 0, a.removeRelativeTarget()));
}
function r3(a) {
  const { visualElement: l } = a.options;
  l && l.getProps().onBeforeLayoutMeasure && l.notify("BeforeLayoutMeasure"), a.resetTransform();
}
function fv(a) {
  a.finishAnimation(), a.targetDelta = a.relativeTarget = a.target = void 0, a.isProjectionDirty = !0;
}
function c3(a) {
  a.resolveTargetDelta();
}
function f3(a) {
  a.calcProjection();
}
function h3(a) {
  a.resetSkewAndRotation();
}
function d3(a) {
  a.removeLeadSnapshot();
}
function hv(a, l, o) {
  a.translate = zt(l.translate, 0, o), a.scale = zt(l.scale, 1, o), a.origin = l.origin, a.originPoint = l.originPoint;
}
function dv(a, l, o, r) {
  a.min = zt(l.min, o.min, r), a.max = zt(l.max, o.max, r);
}
function m3(a, l, o, r) {
  dv(a.x, l.x, o.x, r), dv(a.y, l.y, o.y, r);
}
function y3(a) {
  return a.animationValues && a.animationValues.opacityExit !== void 0;
}
const g3 = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, mv = (a) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(a), yv = mv("applewebkit/") && !mv("chrome/") ? Math.round : Le;
function gv(a) {
  a.min = yv(a.min), a.max = yv(a.max);
}
function v3(a) {
  gv(a.x), gv(a.y);
}
function f1(a, l, o) {
  return a === "position" || a === "preserve-aspect" && !w2(av(l), av(o), 0.2);
}
function p3(a) {
  return a !== a.root && a.scroll?.wasRoot;
}
const S3 = c1({
  attachResizeListener: (a, l) => ru(a, "resize", l),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
    y: document.documentElement.scrollTop || document.body?.scrollTop || 0
  }),
  checkIsScrollRoot: () => !0
}), Ef = {
  current: void 0
}, h1 = c1({
  measureScroll: (a) => ({
    x: a.scrollLeft,
    y: a.scrollTop
  }),
  defaultParent: () => {
    if (!Ef.current) {
      const a = new S3({});
      a.mount(window), a.setOptions({ layoutScroll: !0 }), Ef.current = a;
    }
    return Ef.current;
  },
  resetTransform: (a, l) => {
    a.style.transform = l !== void 0 ? l : "none";
  },
  checkIsScrollRoot: (a) => window.getComputedStyle(a).position === "fixed"
}), Rh = I.createContext({
  transformPagePoint: (a) => a,
  isStatic: !1,
  reducedMotion: "never"
});
function T3(a = !0) {
  const l = I.useContext(th);
  if (l === null)
    return [!0, null];
  const { isPresent: o, onExitComplete: r, register: c } = l, d = I.useId();
  I.useEffect(() => {
    if (a)
      return c(d);
  }, [a]);
  const h = I.useCallback(() => a && r && r(d), [d, r, a]);
  return !o && r ? [!1, h] : [!0];
}
const d1 = I.createContext({ strict: !1 }), vv = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let pv = !1;
function b3() {
  if (pv)
    return;
  const a = {};
  for (const l in vv)
    a[l] = {
      isEnabled: (o) => vv[l].some((r) => !!o[r])
    };
  kp(a), pv = !0;
}
function m1() {
  return b3(), E2();
}
function E3(a) {
  const l = m1();
  for (const o in a)
    l[o] = {
      ...l[o],
      ...a[o]
    };
  kp(l);
}
const bo = /* @__PURE__ */ I.createContext({});
function A3(a, l) {
  if (To(a)) {
    const { initial: o, animate: r } = a;
    return {
      initial: o === !1 || su(o) ? o : void 0,
      animate: su(r) ? r : void 0
    };
  }
  return a.inherit !== !1 ? l : {};
}
function D3(a) {
  const { initial: l, animate: o } = A3(a, I.useContext(bo));
  return I.useMemo(() => ({ initial: l, animate: o }), [Sv(l), Sv(o)]);
}
function Sv(a) {
  return Array.isArray(a) ? a.join(" ") : a;
}
const _h = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function y1(a, l, o) {
  for (const r in l)
    !he(l[r]) && !$p(r, o) && (a[r] = l[r]);
}
function M3({ transformTemplate: a }, l) {
  return I.useMemo(() => {
    const o = _h();
    return Mh(o, l, a), Object.assign({}, o.vars, o.style);
  }, [l]);
}
function x3(a, l) {
  const o = a.style || {}, r = {};
  return y1(r, o, a), Object.assign(r, M3(a, l)), r;
}
function C3(a, l) {
  const o = {}, r = x3(a, l);
  return a.drag && a.dragListener !== !1 && (o.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = a.drag === !0 ? "none" : `pan-${a.drag === "x" ? "y" : "x"}`), a.tabIndex === void 0 && (a.onTap || a.onTapStart || a.whileTap) && (o.tabIndex = 0), o.style = r, o;
}
const g1 = () => ({
  ..._h(),
  attrs: {}
});
function O3(a, l, o, r) {
  const c = I.useMemo(() => {
    const d = g1();
    return Lp(d, l, e1(r), a.transformTemplate, a.style), {
      ...d.attrs,
      style: { ...d.style }
    };
  }, [l]);
  if (a.style) {
    const d = {};
    y1(d, a.style, a), c.style = { ...d, ...c.style };
  }
  return c;
}
const z3 = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function go(a) {
  return a.startsWith("while") || a.startsWith("drag") && a !== "draggable" || a.startsWith("layout") || a.startsWith("onTap") || a.startsWith("onPan") || a.startsWith("onLayout") || z3.has(a);
}
function R3(a, l) {
  return a.startsWith("on") ? !go(a) : l?.(a) ?? !go(a);
}
function _3(a, l, o, r) {
  const c = {};
  for (const d in a)
    d === "values" && typeof a.values == "object" || he(a[d]) || (R3(d, r) || o === !0 && go(d) || !l && !go(d) || // If trying to use native HTML drag events, forward drag listeners
    a.draggable && d.startsWith("onDrag")) && (c[d] = a[d]);
  return c;
}
const N3 = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Nh(a) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof a != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    a.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(N3.indexOf(a) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(a))
    )
  );
}
function V3(a, l, o, { latestValues: r }, c, d = !1, h, m) {
  const p = (h ?? Nh(a) ? O3 : C3)(l, r, c, a), v = _3(l, typeof a == "string", d, m), g = a !== I.Fragment ? { ...v, ...p, ref: o } : {}, { children: b } = l, _ = I.useMemo(() => he(b) ? b.get() : b, [b]);
  return I.createElement(a, {
    ...g,
    children: _
  });
}
function U3({ scrapeMotionValuesFromProps: a, createRenderState: l }, o, r, c) {
  return {
    latestValues: w3(o, r, c, a),
    renderState: l()
  };
}
function w3(a, l, o, r) {
  const c = {}, d = r(a, {});
  for (const b in d)
    c[b] = eo(d[b]);
  let { initial: h, animate: m } = a;
  const S = To(a), p = Pp(a);
  l && p && !S && a.inherit !== !1 && (h === void 0 && (h = l.initial), m === void 0 && (m = l.animate));
  let v = o ? o.initial === !1 : !1;
  v = v || h === !1;
  const g = v ? m : h;
  if (g && typeof g != "boolean" && !So(g)) {
    const b = Array.isArray(g) ? g : [g];
    for (let _ = 0; _ < b.length; _++) {
      const R = zp(a, b[_]);
      if (R) {
        const { transitionEnd: B, transition: V, ...Q } = R;
        for (const Y in Q) {
          let Z = Q[Y];
          if (Array.isArray(Z)) {
            const q = v ? Z.length - 1 : 0;
            Z = Z[q];
          }
          Z !== null && (c[Y] = Z);
        }
        for (const Y in B)
          c[Y] = B[Y];
      }
    }
  }
  return c;
}
const v1 = (a) => (l, o) => {
  const r = I.useContext(bo), c = I.useContext(th), d = () => U3(a, l, r, c);
  return o ? d() : Wa(d);
}, B3 = /* @__PURE__ */ v1({
  scrapeMotionValuesFromProps: zh,
  createRenderState: _h
}), H3 = /* @__PURE__ */ v1({
  scrapeMotionValuesFromProps: n1,
  createRenderState: g1
}), L3 = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
function j3(a, l, o) {
  const r = I.useRef(o);
  I.useInsertionEffect(() => {
    r.current = o;
  });
  const c = I.useRef(null);
  return I.useCallback((d) => {
    d && a.onMount?.(d), l && (d ? l.mount(d) : l.unmount());
    const h = r.current;
    if (typeof h == "function")
      if (d) {
        const m = h(d);
        typeof m == "function" && (c.current = m);
      } else c.current ? (c.current(), c.current = null) : h(d);
    else h && (h.current = d);
  }, [l]);
}
const p1 = I.createContext({});
function Za(a) {
  return a && typeof a == "object" && Object.prototype.hasOwnProperty.call(a, "current");
}
function Y3(a, l, o, r, c, d) {
  const { visualElement: h } = I.useContext(bo), m = I.useContext(d1), S = I.useContext(th), p = I.useContext(Rh), v = p.reducedMotion, g = p.skipAnimations, b = I.useRef(null), _ = I.useRef(!1);
  r = r || m.renderer, !b.current && r && (b.current = r(a, {
    visualState: l,
    parent: h,
    props: o,
    presenceContext: S,
    blockInitialAnimation: S ? S.initial === !1 : !1,
    reducedMotionConfig: v,
    skipAnimations: g,
    isSVG: d
  }), _.current && b.current && (b.current.manuallyAnimateOnMount = !0));
  const R = b.current, B = I.useContext(p1);
  R && !R.projection && c && (R.type === "html" || R.type === "svg") && G3(b.current, o, c, B);
  const V = I.useRef(!1);
  I.useInsertionEffect(() => {
    R && V.current && R.update(o, S);
  });
  const Q = o[Np], Y = I.useRef(!!Q && typeof window < "u" && !window.MotionHandoffIsComplete?.(Q) && window.MotionHasOptimisedAnimation?.(Q));
  return ao(() => {
    !_.current || !R || (R.animationState?.animateChanges(), R.enteringChildren = void 0);
  }, []), ao(() => {
    _.current = !0, R && (V.current = !0, window.MotionIsMounted = !0, R.updateFeatures(), R.scheduleRenderMicrotask(), Y.current && R.animationState && R.animationState.animateChanges());
  }), I.useEffect(() => {
    R && (!Y.current && R.animationState && R.animationState.animateChanges(), Y.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(Q);
    }), Y.current = !1), R.enteringChildren = void 0);
  }), R;
}
function G3(a, l, o, r) {
  const { layoutId: c, layout: d, drag: h, dragConstraints: m, layoutScroll: S, layoutRoot: p, layoutAnchor: v, layoutCrossfade: g } = l;
  a.projection = new o(a.latestValues, l["data-framer-portal-id"] ? void 0 : S1(a.parent)), a.projection.setOptions({
    layoutId: c,
    layout: d,
    alwaysMeasureLayout: !!h || m && Za(m),
    visualElement: a,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof d == "string" ? d : "both",
    initialPromotionConfig: r,
    crossfade: g,
    layoutScroll: S,
    layoutRoot: p,
    layoutAnchor: v
  });
}
function S1(a) {
  if (a)
    return a.options.allowProjection !== !1 ? a.projection : S1(a.parent);
}
function Af(a, { forwardMotionProps: l = !1, type: o } = {}, r, c) {
  r && E3(r);
  const d = o ? o === "svg" : Nh(a), h = d ? H3 : B3;
  function m(p, v) {
    let g;
    const b = {
      ...I.useContext(Rh),
      ...p,
      layoutId: q3(p)
    }, { isStatic: _, isValidProp: R } = b, B = D3(p), V = h(p, _);
    if (!_ && typeof window < "u") {
      X3();
      const Q = Q3(b);
      g = Q.MeasureLayout, B.visualElement = Y3(a, V, b, c, Q.ProjectionNode, d);
    }
    return Ut.jsxs(bo.Provider, { value: B, children: [g && B.visualElement ? Ut.jsx(g, { visualElement: B.visualElement, ...b }) : null, V3(a, p, j3(V, B.visualElement, v), V, _, l, d, R)] });
  }
  m.displayName = `motion.${typeof a == "string" ? a : `create(${a.displayName ?? a.name ?? ""})`}`;
  const S = I.forwardRef(m);
  return S[L3] = a, S;
}
function q3({ layoutId: a }) {
  const l = I.useContext(Yv).id;
  return l && a !== void 0 ? l + "-" + a : a;
}
function X3(a, l) {
  I.useContext(d1).strict;
}
function Q3(a) {
  const l = m1(), { drag: o, layout: r } = l;
  if (!o && !r)
    return {};
  const c = { ...o, ...r };
  return {
    MeasureLayout: o?.isEnabled(a) || r?.isEnabled(a) ? c.MeasureLayout : void 0,
    ProjectionNode: c.ProjectionNode
  };
}
function Z3(a, l) {
  if (typeof Proxy > "u")
    return Af;
  const o = /* @__PURE__ */ new Map(), r = (d, h) => Af(d, h, a, l), c = (d, h) => r(d, h);
  return new Proxy(c, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (d, h) => h === "create" ? r : (o.has(h) || o.set(h, Af(h, void 0, a, l)), o.get(h))
  });
}
const K3 = (a, l) => l.isSVG ?? Nh(a) ? new C2(l) : new M2(l, {
  allowProjection: a !== I.Fragment
});
class J3 extends bi {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(l) {
    super(l), l.animationState || (l.animationState = z2(l));
  }
  updateAnimationControlsSubscription() {
    const { animate: l } = this.node.getProps();
    So(l) && (this.unmountControls = l.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: l } = this.node.getProps(), { animate: o } = this.node.prevProps || {};
    l !== o && this.updateAnimationControlsSubscription();
  }
  unmount() {
    this.node.animationState.reset(), this.unmountControls?.();
  }
}
let P3 = 0;
class F3 extends bi {
  constructor() {
    super(...arguments), this.id = P3++;
  }
  update() {
    const { presenceContext: l, prevPresenceContext: o, animationState: r } = this.node;
    if (!l || !r)
      return;
    const { isPresent: c, onExitComplete: d } = l, h = o?.isPresent;
    if (c === h)
      return;
    if (c && h === !1) {
      if (this.exit === !0) {
        const { initial: S } = this.node.getProps();
        if (S && !Array.isArray(S)) {
          const { transition: p, transitionEnd: v, ...g } = Wi(this.node, S) || {};
          for (const b in g)
            this.node.getValue(b)?.jump(g[b]);
        }
        this.node.blockInitialAnimation = !1, r.reset(), r.animateChanges();
      } else
        r.setActive("exit", !1);
      this.exit = void 0;
      return;
    }
    const m = this.exit = r.setActive("exit", !c);
    d && !c && m.then(() => {
      this.exit === m && (this.exit = !0, d(this.id));
    });
  }
  mount() {
    const { register: l, onExitComplete: o } = this.node.presenceContext || {};
    o && o(this.id), l && (this.unmount = l(this.id));
  }
  unmount() {
  }
}
const k3 = {
  animation: {
    Feature: J3
  },
  exit: {
    Feature: F3
  }
};
function Eo(a) {
  return {
    point: {
      x: a.pageX,
      y: a.pageY
    }
  };
}
const W3 = (a) => (l) => xh(l) && a(l, Eo(l));
function nu(a, l, o, r) {
  return ru(a, l, W3(o), r);
}
const T1 = ({ current: a }) => a ? a.ownerDocument.defaultView : null, Tv = (a, l) => Math.abs(a - l);
function I3(a, l) {
  const o = Tv(a.x, l.x), r = Tv(a.y, l.y);
  return Math.sqrt(o ** 2 + r ** 2);
}
const bv = /* @__PURE__ */ new Set(["auto", "scroll"]);
class b1 {
  constructor(l, o, { transformPagePoint: r, contextWindow: c = window, dragSnapToOrigin: d = !1, distanceThreshold: h = 3, element: m } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (R) => {
      this.handleScroll(R.target);
    }, this.onWindowScroll = () => {
      this.handleScroll(window);
    }, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = Zs(this.lastRawMoveEventInfo, this.transformPagePoint));
      const R = Df(this.lastMoveEventInfo, this.history), B = this.startEvent !== null, V = I3(R.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!B && !V)
        return;
      const { point: Q } = R;
      this.history.push({ ...Q, timestamp: fe.now() });
      const { onStart: Y, onMove: Z } = this.handlers;
      B || (Y && Y(this.lastMoveEvent, R), this.startEvent = this.lastMoveEvent), Z && Z(this.lastMoveEvent, R);
    }, this.handlePointerMove = (R, B) => {
      this.lastMoveEvent = R, this.lastRawMoveEventInfo = B, this.lastMoveEventInfo = Zs(B, this.transformPagePoint), this.hasPendingMove = !0, bt.update(this.updatePoint, !0);
    }, this.handlePointerUp = (R, B) => {
      this.hasPendingMove && this.updatePoint(), this.end();
      const { onEnd: V, onSessionEnd: Q, resumeAnimation: Y } = this.handlers;
      if ((this.dragSnapToOrigin || !this.startEvent) && Y && Y(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const Z = Df(R.type === "pointercancel" ? this.lastMoveEventInfo : Zs(B, this.transformPagePoint), this.history);
      this.startEvent && V && V(R, Z), Q && Q(R, Z);
    }, !xh(l))
      return;
    this.dragSnapToOrigin = d, this.handlers = o, this.transformPagePoint = r, this.distanceThreshold = h, this.contextWindow = c || window;
    const S = Eo(l), p = Zs(S, this.transformPagePoint), { point: v } = p, { timestamp: g } = Pt;
    this.history = [{ ...v, timestamp: g }];
    const { onSessionStart: b } = o;
    b && b(l, Df(p, this.history));
    const _ = { passive: !0, capture: !0 };
    this.removeListeners = cu(nu(this.contextWindow, "pointermove", this.handlePointerMove, _), nu(this.contextWindow, "pointerup", this.handlePointerUp, _), nu(this.contextWindow, "pointercancel", this.handlePointerUp, _)), m && this.startScrollTracking(m);
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(l) {
    let o = l.parentElement;
    for (; o; ) {
      const r = getComputedStyle(o);
      (bv.has(r.overflowX) || bv.has(r.overflowY)) && this.scrollPositions.set(o, {
        x: o.scrollLeft,
        y: o.scrollTop
      }), o = o.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    }), window.addEventListener("scroll", this.onElementScroll, {
      capture: !0
    }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: !0
      }), window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(l) {
    const o = this.scrollPositions.get(l);
    if (!o)
      return;
    const r = l === window, c = r ? { x: window.scrollX, y: window.scrollY } : {
      x: l.scrollLeft,
      y: l.scrollTop
    }, d = { x: c.x - o.x, y: c.y - o.y };
    d.x === 0 && d.y === 0 || (r ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += d.x, this.lastMoveEventInfo.point.y += d.y) : this.history.length > 0 && (this.history[0].x -= d.x, this.history[0].y -= d.y), this.scrollPositions.set(l, c), bt.update(this.updatePoint, !0));
  }
  updateHandlers(l) {
    this.handlers = l;
  }
  end() {
    this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), sn(this.updatePoint);
  }
}
function Zs(a, l) {
  return l ? { point: l(a.point) } : a;
}
function Ev(a, l) {
  return { x: a.x - l.x, y: a.y - l.y };
}
function Df({ point: a }, l) {
  return {
    point: a,
    delta: Ev(a, E1(l)),
    offset: Ev(a, $3(l)),
    velocity: tD(l, 0.1)
  };
}
function $3(a) {
  return a[0];
}
function E1(a) {
  return a[a.length - 1];
}
function tD(a, l) {
  if (a.length < 2)
    return { x: 0, y: 0 };
  let o = a.length - 1, r = null;
  const c = E1(a);
  for (; o >= 0 && (r = a[o], !(c.timestamp - r.timestamp > /* @__PURE__ */ ke(l))); )
    o--;
  if (!r)
    return { x: 0, y: 0 };
  r === a[0] && a.length > 2 && c.timestamp - r.timestamp > /* @__PURE__ */ ke(l) * 2 && (r = a[1]);
  const d = /* @__PURE__ */ Fe(c.timestamp - r.timestamp);
  if (d === 0)
    return { x: 0, y: 0 };
  const h = {
    x: (c.x - r.x) / d,
    y: (c.y - r.y) / d
  };
  return h.x === 1 / 0 && (h.x = 0), h.y === 1 / 0 && (h.y = 0), h;
}
function eD(a, { min: l, max: o }, r) {
  return l !== void 0 && a < l ? a = r ? zt(l, a, r.min) : Math.max(a, l) : o !== void 0 && a > o && (a = r ? zt(o, a, r.max) : Math.min(a, o)), a;
}
function Av(a, l, o) {
  return {
    min: l !== void 0 ? a.min + l : void 0,
    max: o !== void 0 ? a.max + o - (a.max - a.min) : void 0
  };
}
function nD(a, { top: l, left: o, bottom: r, right: c }) {
  return {
    x: Av(a.x, o, c),
    y: Av(a.y, l, r)
  };
}
function Dv(a, l) {
  let o = l.min - a.min, r = l.max - a.max;
  return l.max - l.min < a.max - a.min && ([o, r] = [r, o]), { min: o, max: r };
}
function iD(a, l) {
  return {
    x: Dv(a.x, l.x),
    y: Dv(a.y, l.y)
  };
}
function aD(a, l) {
  let o = 0.5;
  const r = pe(a), c = pe(l);
  return c > r ? o = /* @__PURE__ */ Ii(l.min, l.max - r, a.min) : r > c && (o = /* @__PURE__ */ Ii(a.min, a.max - c, l.min)), Mn(0, 1, o);
}
function lD(a, l) {
  const o = {};
  return l.min !== void 0 && (o.min = l.min - a.min), l.max !== void 0 && (o.max = l.max - a.min), o;
}
const kf = 0.35;
function uD(a = kf) {
  return a === !1 ? a = 0 : a === !0 && (a = kf), {
    x: Mv(a, "left", "right"),
    y: Mv(a, "top", "bottom")
  };
}
function Mv(a, l, o) {
  return {
    min: xv(a, l),
    max: xv(a, o)
  };
}
function xv(a, l) {
  return typeof a == "number" ? a : a[l] || 0;
}
const sD = /* @__PURE__ */ new WeakMap();
class oD {
  constructor(l) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = kt(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = l;
  }
  start(l, { snapToCursor: o = !1, distanceThreshold: r } = {}) {
    const { presenceContext: c } = this.visualElement;
    if (c && c.isPresent === !1)
      return;
    const d = (g) => {
      o && this.snapToCursor(g), this.stopAnimation();
    }, h = (g, b) => {
      const { drag: _, dragPropagation: R, onDragStart: B } = this.getProps();
      if (_ && !R && (this.openDragLock && this.openDragLock(), this.openDragLock = t2(_), !this.openDragLock))
        return;
      this.latestPointerEvent = g, this.latestPanInfo = b, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), bn((Q) => {
        let Y = this.getAxisMotionValue(Q).get() || 0;
        if (Dn.test(Y)) {
          const { projection: Z } = this.visualElement;
          if (Z && Z.layout) {
            const q = Z.layout.layoutBox[Q];
            q && (Y = pe(q) * (parseFloat(Y) / 100));
          }
        }
        this.originPoint[Q] = Y;
      }), B && bt.update(() => B(g, b), !1, !0), Qf(this.visualElement, "transform");
      const { animationState: V } = this.visualElement;
      V && V.setActive("whileDrag", !0);
    }, m = (g, b) => {
      this.latestPointerEvent = g, this.latestPanInfo = b;
      const { dragPropagation: _, dragDirectionLock: R, onDirectionLock: B, onDrag: V } = this.getProps();
      if (!_ && !this.openDragLock)
        return;
      const { offset: Q } = b;
      if (R && this.currentDirection === null) {
        this.currentDirection = cD(Q), this.currentDirection !== null && B && B(this.currentDirection);
        return;
      }
      this.updateAxis("x", b.point, Q), this.updateAxis("y", b.point, Q), this.visualElement.render(), V && bt.update(() => V(g, b), !1, !0);
    }, S = (g, b) => {
      this.latestPointerEvent = g, this.latestPanInfo = b, this.stop(g, b), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, p = () => {
      const { dragSnapToOrigin: g } = this.getProps();
      (g || this.constraints) && this.startAnimation({ x: 0, y: 0 });
    }, { dragSnapToOrigin: v } = this.getProps();
    this.panSession = new b1(l, {
      onSessionStart: d,
      onStart: h,
      onMove: m,
      onSessionEnd: S,
      resumeAnimation: p
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: v,
      distanceThreshold: r,
      contextWindow: T1(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(l, o) {
    const r = l || this.latestPointerEvent, c = o || this.latestPanInfo, d = this.isDragging;
    if (this.cancel(), !d || !c || !r)
      return;
    const { velocity: h } = c;
    this.startAnimation(h);
    const { onDragEnd: m } = this.getProps();
    m && bt.postRender(() => m(r, c));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: l, animationState: o } = this.visualElement;
    l && (l.isAnimationBlocked = !1), this.endPanSession();
    const { dragPropagation: r } = this.getProps();
    !r && this.openDragLock && (this.openDragLock(), this.openDragLock = null), o && o.setActive("whileDrag", !1);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end(), this.panSession = void 0;
  }
  updateAxis(l, o, r) {
    const { drag: c } = this.getProps();
    if (!r || !Ks(l, c, this.currentDirection))
      return;
    const d = this.getAxisMotionValue(l);
    let h = this.originPoint[l] + r[l];
    this.constraints && this.constraints[l] && (h = eD(h, this.constraints[l], this.elastic[l])), d.set(h);
  }
  resolveConstraints() {
    const { dragConstraints: l, dragElastic: o } = this.getProps(), r = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, c = this.constraints;
    l && Za(l) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : l && r ? this.constraints = nD(r.layoutBox, l) : this.constraints = !1, this.elastic = uD(o), c !== this.constraints && !Za(l) && r && this.constraints && !this.hasMutatedConstraints && bn((d) => {
      this.constraints !== !1 && this.getAxisMotionValue(d) && (this.constraints[d] = lD(r.layoutBox[d], this.constraints[d]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: l, onMeasureDragConstraints: o } = this.getProps();
    if (!l || !Za(l))
      return !1;
    const r = l.current, { projection: c } = this.visualElement;
    if (!c || !c.layout)
      return !1;
    c.root && (c.root.scroll = void 0, c.root.updateScroll());
    const d = $A(r, c.root, this.visualElement.getTransformPagePoint());
    let h = iD(c.layout.layoutBox, d);
    if (o) {
      const m = o(kA(h));
      this.hasMutatedConstraints = !!m, m && (h = jp(m));
    }
    return h;
  }
  startAnimation(l) {
    const { drag: o, dragMomentum: r, dragElastic: c, dragTransition: d, dragSnapToOrigin: h, onDragTransitionEnd: m } = this.getProps(), S = this.constraints || {}, p = bn((v) => {
      if (!Ks(v, o, this.currentDirection))
        return;
      let g = S && S[v] || {};
      (h === !0 || h === v) && (g = { min: 0, max: 0 });
      const b = c ? 200 : 1e6, _ = c ? 40 : 1e7, R = {
        type: "inertia",
        velocity: r ? l[v] : 0,
        bounceStiffness: b,
        bounceDamping: _,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...d,
        ...g
      };
      return this.startAxisValueAnimation(v, R);
    });
    return Promise.all(p).then(m);
  }
  startAxisValueAnimation(l, o) {
    const r = this.getAxisMotionValue(l);
    return Qf(this.visualElement, l), r.start(bh(l, r, 0, o, this.visualElement, !1));
  }
  stopAnimation() {
    bn((l) => this.getAxisMotionValue(l).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(l) {
    const o = `_drag${l.toUpperCase()}`, c = this.visualElement.getProps()[o];
    return c || this.visualElement.getValue(l, this.visualElement.latestValues[l] ?? 0);
  }
  /**
   * Measure the live box - projection.layout may or may not include the
   * drag transform, depending on when it was measured.
   */
  snapToCursor({ clientX: l, clientY: o }) {
    const { drag: r } = this.getProps(), c = { x: l, y: o }, d = this.visualElement.getTransformPagePoint()?.(c) || c, h = this.visualElement.measureViewportBox();
    bn((m) => {
      if (!Ks(m, r, this.currentDirection))
        return;
      const S = this.getAxisMotionValue(m), { min: p, max: v } = h[m];
      S.set((S.get() || 0) + d[m] - zt(p, v, 0.5));
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: l, dragConstraints: o } = this.getProps(), { projection: r } = this.visualElement;
    if (!Za(o) || !r || !this.constraints)
      return;
    this.stopAnimation();
    const c = this.constraints, d = { x: 0, y: 0 };
    bn((m) => {
      const S = this.getAxisMotionValue(m).get();
      d[m] = aD({ min: S, max: S }, c[m]);
    });
    const { transformTemplate: h } = this.visualElement.getProps();
    this.visualElement.current.style.transform = h ? h({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.constraints = !1, this.resolveConstraints(), bn((m) => {
      const S = this.getAxisMotionValue(m);
      if (!Ks(m, l, null) || !S.get())
        return;
      const { min: p, max: v } = this.constraints[m];
      S.set(zt(p, v, d[m]));
    }), this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    sD.set(this.visualElement, this);
    const l = this.visualElement.current, o = nu(l, "pointerdown", (p) => {
      const { drag: v, dragListener: g = !0 } = this.getProps(), b = p.target, _ = b !== l && u2(b);
      v && g && !_ && this.start(p);
    });
    let r;
    const c = () => {
      const { dragConstraints: p } = this.getProps();
      Za(p) && p.current && (this.constraints = this.resolveRefConstraints(), r || (r = rD(l, p.current, () => this.scalePositionWithinConstraints())));
    }, { projection: d } = this.visualElement, h = d.addEventListener("measure", c);
    d && !d.layout && (d.root && d.root.updateScroll(), d.updateLayout()), bt.read(c);
    const m = ru(window, "resize", () => this.scalePositionWithinConstraints()), S = d.addEventListener("didUpdate", (({ delta: p, hasLayoutChanged: v }) => {
      this.isDragging && v && (bn((g) => {
        const b = this.getAxisMotionValue(g);
        b && (this.originPoint[g] += p[g].translate, b.set(b.get() + p[g].translate));
      }), this.visualElement.render());
    }));
    return () => {
      m(), o(), h(), S && S(), r && r();
    };
  }
  getProps() {
    const l = this.visualElement.getProps(), { drag: o = !1, dragDirectionLock: r = !1, dragPropagation: c = !1, dragConstraints: d = !1, dragElastic: h = kf, dragMomentum: m = !0 } = l;
    return {
      ...l,
      drag: o,
      dragDirectionLock: r,
      dragPropagation: c,
      dragConstraints: d,
      dragElastic: h,
      dragMomentum: m
    };
  }
}
function Cv(a) {
  let l = !0;
  return () => {
    if (l) {
      l = !1;
      return;
    }
    a();
  };
}
function rD(a, l, o) {
  const r = uu(a, Cv(o)), c = uu(l, Cv(o));
  return () => {
    r(), c();
  };
}
function Ks(a, l, o) {
  return (l === !0 || l === a) && (o === null || o === a);
}
function cD(a, l = 10) {
  let o = null;
  return Math.abs(a.y) > l ? o = "y" : Math.abs(a.x) > l && (o = "x"), o;
}
class fD extends bi {
  constructor(l) {
    super(l), this.removeGroupControls = Le, this.removeListeners = Le, this.controls = new oD(l);
  }
  mount() {
    const { dragControls: l } = this.node.getProps();
    l && (this.removeGroupControls = l.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Le;
  }
  update() {
    const { dragControls: l } = this.node.getProps(), { dragControls: o } = this.node.prevProps || {};
    l !== o && (this.removeGroupControls(), l && (this.removeGroupControls = l.subscribe(this.controls)));
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
  }
}
const Mf = (a) => (l, o) => {
  a && bt.update(() => a(l, o), !1, !0);
};
class hD extends bi {
  constructor() {
    super(...arguments), this.removePointerDownListener = Le;
  }
  onPointerDown(l) {
    this.session = new b1(l, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: T1(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: l, onPanStart: o, onPan: r, onPanEnd: c } = this.node.getProps();
    return {
      onSessionStart: Mf(l),
      onStart: Mf(o),
      onMove: Mf(r),
      onEnd: (d, h) => {
        delete this.session, c && bt.postRender(() => c(d, h));
      }
    };
  }
  mount() {
    this.removePointerDownListener = nu(this.node.current, "pointerdown", (l) => this.onPointerDown(l));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
let xf = !1;
class dD extends I.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: l, layoutGroup: o, switchLayoutGroup: r, layoutId: c } = this.props, { projection: d } = l;
    d && (o.group && o.group.add(d), r && r.register && c && r.register(d), xf && d.root.didUpdate(), d.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), d.setOptions({
      ...d.options,
      layoutDependency: this.props.layoutDependency,
      onExitComplete: () => this.safeToRemove()
    })), no.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(l) {
    const { layoutDependency: o, visualElement: r, drag: c, isPresent: d } = this.props, { projection: h } = r;
    return h && (h.isPresent = d, l.layoutDependency !== o && h.setOptions({
      ...h.options,
      layoutDependency: o
    }), xf = !0, c || l.layoutDependency !== o || o === void 0 || l.isPresent !== d ? h.willUpdate() : this.safeToRemove(), l.isPresent !== d && (d ? h.promote() : h.relegate() || bt.postRender(() => {
      const m = h.getStack();
      (!m || !m.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { visualElement: l, layoutAnchor: o } = this.props, { projection: r } = l;
    r && (r.options.layoutAnchor = o, r.root.didUpdate(), Ia.postRender(() => {
      !r.currentAnimation && r.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: l, layoutGroup: o, switchLayoutGroup: r } = this.props, { projection: c } = l;
    xf = !0, c && (c.scheduleCheckAfterUnmount(), o && o.group && o.group.remove(c), r && r.deregister && r.deregister(c));
  }
  safeToRemove() {
    const { safeToRemove: l } = this.props;
    l && l();
  }
  render() {
    return null;
  }
}
function A1(a) {
  const [l, o] = T3(), r = I.useContext(Yv);
  return Ut.jsx(dD, { ...a, layoutGroup: r, switchLayoutGroup: I.useContext(p1), isPresent: l, safeToRemove: o });
}
const mD = {
  pan: {
    Feature: hD
  },
  drag: {
    Feature: fD,
    ProjectionNode: h1,
    MeasureLayout: A1
  }
};
function Ov(a, l, o) {
  const { props: r } = a;
  a.animationState && r.whileHover && a.animationState.setActive("whileHover", o === "Start");
  const c = "onHover" + o, d = r[c];
  d && bt.postRender(() => d(l, Eo(l)));
}
class yD extends bi {
  mount() {
    const { current: l } = this.node;
    l && (this.unmount = n2(l, (o, r) => (Ov(this.node, r, "Start"), (c) => Ov(this.node, c, "End"))));
  }
  unmount() {
  }
}
class gD extends bi {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let l = !1;
    try {
      l = this.node.current.matches(":focus-visible");
    } catch {
      l = !0;
    }
    !l || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = cu(ru(this.node.current, "focus", () => this.onFocus()), ru(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function zv(a, l, o) {
  const { props: r } = a;
  if (a.current instanceof HTMLButtonElement && a.current.disabled)
    return;
  a.animationState && r.whileTap && a.animationState.setActive("whileTap", o === "Start");
  const c = "onTap" + (o === "End" ? "" : o), d = r[c];
  d && bt.postRender(() => d(l, Eo(l)));
}
class vD extends bi {
  mount() {
    const { current: l } = this.node;
    if (!l)
      return;
    const { globalTapTarget: o, propagate: r } = this.node.props;
    this.unmount = o2(l, (c, d) => (zv(this.node, d, "Start"), (h, { success: m }) => zv(this.node, h, m ? "End" : "Cancel")), {
      useGlobalTarget: o,
      stopPropagation: r?.tap === !1
    });
  }
  unmount() {
  }
}
const Wf = /* @__PURE__ */ new WeakMap(), Cf = /* @__PURE__ */ new WeakMap(), pD = (a) => {
  const l = Wf.get(a.target);
  l && l(a);
}, SD = (a) => {
  a.forEach(pD);
};
function TD({ root: a, ...l }) {
  const o = a || document;
  Cf.has(o) || Cf.set(o, {});
  const r = Cf.get(o), c = JSON.stringify(l);
  return r[c] || (r[c] = new IntersectionObserver(SD, { root: a, ...l })), r[c];
}
function bD(a, l, o) {
  const r = TD(l);
  return Wf.set(a, o), r.observe(a), () => {
    Wf.delete(a), r.unobserve(a);
  };
}
const ED = {
  some: 0,
  all: 1
};
class AD extends bi {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.stopObserver?.();
    const { viewport: l = {} } = this.node.getProps(), { root: o, margin: r, amount: c = "some", once: d } = l, h = {
      root: o ? o.current : void 0,
      rootMargin: r,
      threshold: typeof c == "number" ? c : ED[c]
    }, m = (S) => {
      const { isIntersecting: p } = S;
      if (this.isInView === p || (this.isInView = p, d && !p && this.hasEnteredView))
        return;
      p && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", p);
      const { onViewportEnter: v, onViewportLeave: g } = this.node.getProps(), b = p ? v : g;
      b && b(S);
    };
    this.stopObserver = bD(this.node.current, h, m);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: l, prevProps: o } = this.node;
    ["amount", "margin", "root"].some(DD(l, o)) && this.startObserver();
  }
  unmount() {
    this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
  }
}
function DD({ viewport: a = {} }, { viewport: l = {} } = {}) {
  return (o) => a[o] !== l[o];
}
const MD = {
  inView: {
    Feature: AD
  },
  tap: {
    Feature: vD
  },
  focus: {
    Feature: gD
  },
  hover: {
    Feature: yD
  }
}, xD = {
  layout: {
    ProjectionNode: h1,
    MeasureLayout: A1
  }
}, CD = {
  ...k3,
  ...MD,
  ...mD,
  ...xD
}, Vh = /* @__PURE__ */ Z3(CD, K3), OD = 50, Rv = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0
}), _v = () => ({
  time: 0,
  x: Rv(),
  y: Rv()
}), Uh = {
  x: {
    length: "Width",
    position: "Left"
  },
  y: {
    length: "Height",
    position: "Top"
  }
};
function zD(a, l, o, r) {
  const c = o[l], { length: d, position: h } = Uh[l], m = c.current, S = o.time;
  c.current = Math.abs(a[`scroll${h}`]), c.containerLength = a[`client${d}`], c.targetLength = a[`scroll${d}`], c.scrollLength = c.targetLength - c.containerLength, c.offset.length = 0, c.offset[0] = 0, c.offset[1] = c.scrollLength, c.progress = /* @__PURE__ */ Ii(0, c.scrollLength, c.current);
  const p = r - S;
  c.velocity = p > OD ? 0 : /* @__PURE__ */ ah(c.current - m, p);
}
function RD(a, l, o) {
  for (const r in Uh)
    zD(a, r, l, o);
  l.time = o;
}
const If = {
  start: 0,
  center: 0.5,
  end: 1
};
function Nv(a, l, o = 0) {
  let r = 0;
  if (a in If && (a = If[a]), typeof a == "string") {
    const c = parseFloat(a);
    a.endsWith("px") ? r = c : a.endsWith("%") ? a = c / 100 : a.endsWith("vw") ? r = c / 100 * document.documentElement.clientWidth : a.endsWith("vh") ? r = c / 100 * document.documentElement.clientHeight : a = c;
  }
  return typeof a == "number" && (r = l * a), o + r;
}
const _D = [0, 0];
function io(a, l, o, r) {
  let c = Array.isArray(a) ? a : _D, d = 0, h = 0;
  return typeof a == "number" ? c = [a, a] : typeof a == "string" && (a = a.trim(), a.includes(" ") ? c = a.split(" ") : c = [a, If[a] ? a : "0"]), d = Nv(c[0], o, r), h = Nv(c[1], l), d - h;
}
const D1 = {
  All: [
    [0, 0],
    [1, 1]
  ]
};
function ND(a, l) {
  const o = a.length - 1;
  if (o < 1)
    return 0;
  const r = a[0] > a[o], c = (m) => a[r ? o - m : m];
  if (a[0] === a[1] && l < c(0))
    return r ? 1 : 0;
  let d = 0;
  for (; d < o - 1 && l >= c(d + 1); )
    d++;
  const h = (d + /* @__PURE__ */ Ii(c(d), c(d + 1), l)) / o;
  return r ? 1 - h : h;
}
function VD(a, l) {
  const { offset: o = D1.All, axis: r = "y" } = l, c = a[r];
  c.offset.length = 0;
  const d = o.length;
  for (let h = 0; h < d; h++)
    c.offset[h] = io(o[h], c.containerLength, c.targetLength, c.targetOffset);
  c.progress = Mn(0, 1, ND(c.offset, c.current));
}
function UD(a, l) {
  const o = { x: 0, y: 0 };
  let r = a;
  for (; r && r !== l; )
    if (wp(r))
      o.x += r.offsetLeft, o.y += r.offsetTop, r = r.offsetParent;
    else if (r.tagName === "svg") {
      const c = r.getBoundingClientRect();
      r = r.parentElement;
      const d = r.getBoundingClientRect();
      o.x += c.left - d.left, o.y += c.top - d.top;
    } else if (r instanceof SVGGraphicsElement) {
      const { x: c, y: d } = r.getBBox();
      o.x += c, o.y += d;
      let h = null, m = r.parentNode;
      for (; !h; )
        m.tagName === "svg" && (h = m), m = r.parentNode;
      r = h;
    } else
      break;
  return o;
}
function wD(a) {
  return "getBBox" in a && a.tagName !== "svg" ? a.getBBox() : { width: a.clientWidth, height: a.clientHeight };
}
function BD(a, l, o, r = {}) {
  const { target: c } = r, d = c || r.offset;
  return {
    measure: (h) => {
      if (d) {
        o.time = h.time;
        for (const m in Uh) {
          const S = m, { offset: p } = o[S];
          Object.assign(o[S], h[S]), o[S].offset = p;
        }
        if (c && c !== a) {
          const m = UD(c, a), S = wD(c);
          o.x.targetOffset = m.x, o.y.targetOffset = m.y, o.x.targetLength = S.width, o.y.targetLength = S.height;
        }
        VD(o, r);
      }
    },
    notify: (h) => l(d ? o : h)
  };
}
const Qa = /* @__PURE__ */ new WeakMap(), Vv = /* @__PURE__ */ new WeakMap(), Js = /* @__PURE__ */ new WeakMap(), Ps = /* @__PURE__ */ new WeakMap(), Uv = (a) => a === document.scrollingElement ? window : a;
function M1(a, { container: l = document.scrollingElement, trackContentSize: o = !1, ...r } = {}) {
  if (!l)
    return Le;
  let c = Js.get(l);
  c || (c = /* @__PURE__ */ new Set(), Js.set(l, c));
  const d = _v(), h = BD(l, a, d, r);
  if (c.add(h), !Qa.has(l)) {
    const S = _v(), p = () => {
      RD(l, S, Pt.timestamp);
      for (const _ of c)
        _.measure(S);
      bt.preUpdate(v);
    }, v = () => {
      for (const _ of c)
        _.notify(S);
    }, g = () => bt.read(p);
    Qa.set(l, g);
    const b = Uv(l);
    window.addEventListener("resize", g), l !== document.documentElement && Vv.set(l, uu(l, g)), b.addEventListener("scroll", g), g();
  }
  if (o && !Ps.has(l)) {
    const S = Qa.get(l), p = {
      width: l.scrollWidth,
      height: l.scrollHeight
    }, v = () => {
      const b = l.scrollWidth, _ = l.scrollHeight;
      (p.width !== b || p.height !== _) && (S(), p.width = b, p.height = _);
    }, g = bt.read(v, !0);
    Ps.set(l, g);
  }
  const m = Qa.get(l);
  return bt.read(m, !1, !0), () => {
    sn(m);
    const S = Js.get(l);
    if (!S || (S.delete(h), S.size))
      return;
    Js.delete(l);
    const p = Qa.get(l);
    Qa.delete(l), p && (Uv(l).removeEventListener("scroll", p), Vv.get(l)?.(), window.removeEventListener("resize", p));
    const v = Ps.get(l);
    v && (sn(v), Ps.delete(l));
  };
}
function HD(a) {
  return typeof window > "u" ? !1 : a ? Tp() : Sh();
}
const wv = /* @__PURE__ */ new Map();
function LD({ container: a, target: l, axis: o }) {
  let r = wv.get(a);
  r || (r = /* @__PURE__ */ new Map(), wv.set(a, r));
  const c = l ?? "self";
  let d = r.get(c);
  return d || (d = {}, r.set(c, d)), d[o] || (d[o] = l ? new ViewTimeline({ subject: l, axis: o }) : new ScrollTimeline({ source: a, axis: o }));
}
const jD = (a) => {
  if (/v/u.test(a))
    return [];
  const l = io(a, 0, 0, 0);
  return [io(a, 0, 1, 0) - l, l - io(a, 1, 0, 0), l];
}, Bv = ([a, l, o]) => !o && (l === 0 || l === 1) && `${l ? "entry" : "exit"}-crossing ${a * 100}%`;
function x1(a = D1.All) {
  if (a.length !== 2)
    return;
  const [l, o] = a.map(jD), r = [Bv(l), Bv(o)], c = o[0] - l[0], d = l[1] - o[1];
  if (r[0] && r[1] && (c || d))
    return {
      points: r,
      a: c,
      b: d,
      cover: !l[0] && c === 1 && d === 1
    };
}
function YD(a, l) {
  const { target: o, container: r, axis: c } = l, d = o && x1(l.offset), h = HD(o) && (o ? !!d : !l.offset), m = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set();
  let p, v = !1;
  const g = (_, R) => {
    const [B, V] = d.points;
    R.effect.updateTiming({
      direction: v ? _ === "normal" ? "reverse" : "alternate-reverse" : _
    }), Object.assign(R, {
      rangeStart: v ? V : B,
      rangeEnd: v ? B : V
    }), R.play();
  }, b = [
    a.attachTimeline({
      /**
       * Read only by WAAPI animations, so values driven from JS don't
       * create a native timeline they won't use.
       */
      get timeline() {
        return h ? LD(l) : void 0;
      },
      onAttach: d && ((_) => {
        const R = _.effect.getTiming().direction;
        m.set(_, R), g(R, _);
      }),
      /**
       * Values driven from JS all track the offset with scrollInfo,
       * which measures once per frame for all of them.
       */
      observe: (_) => (_.pause(), S.add(_), p || (p = M1((R) => {
        S.forEach((B) => {
          B.time = B.iterationDuration * R[c].progress;
        });
      }, l)), () => S.delete(_))
    })
  ];
  if (h && d) {
    const { a: _, b: R } = d, B = c === "y" ? "clientHeight" : "clientWidth", V = () => {
      v !== (v = _ * o[B] + R * r[B] < 0) && m.forEach(g);
    };
    V(), _ * R < 0 && b.push(uu(V), uu([o, r], V));
  }
  return () => {
    b.forEach((_) => _()), p?.();
  };
}
function C1(a, { axis: l = "y", source: o, container: r = document.scrollingElement, ...c } = {}) {
  if (!r)
    return Le;
  const d = {
    axis: l,
    container: o || r,
    ...c
  };
  return typeof a == "function" ? M1((h) => a(h[l].progress, h), d) : YD(a, d);
}
const GD = () => ({
  scrollX: un(0),
  scrollY: un(0),
  scrollXProgress: un(0),
  scrollYProgress: un(0)
}), Fa = (a) => a ? !a.current : !1;
function Hv(a, l, o, r) {
  return {
    // Refs attach child-first; defer so target.current is populated
    // before scroll() reads it.
    factory: (c) => {
      let d;
      const h = () => {
        if (Fa(o) || Fa(r)) {
          Ia.read(h);
          return;
        }
        d = C1(c, {
          ...l,
          axis: a,
          container: o?.current || void 0,
          target: r?.current || void 0
        });
      };
      return Ia.read(h), () => {
        Xp(h), d?.();
      };
    },
    times: [0, 1],
    keyframes: [0, 1],
    ease: (c) => c,
    duration: 1
  };
}
function qD(a, l) {
  return typeof window > "u" ? !1 : a ? Tp() && !!x1(l) : Sh() && !l;
}
function Of({ container: a, target: l, ...o } = {}) {
  const r = Wa(GD);
  qD(l, o.offset) && (r.scrollXProgress.accelerate = Hv("x", o, a, l), r.scrollYProgress.accelerate = Hv("y", o, a, l));
  const c = I.useRef(null), d = I.useRef(!1), h = I.useCallback(() => (c.current = C1((m, { x: S, y: p }) => {
    r.scrollX.set(S.current), r.scrollXProgress.set(S.progress), r.scrollY.set(p.current), r.scrollYProgress.set(p.progress);
  }, {
    ...o,
    container: a?.current || void 0,
    target: l?.current || void 0
  }), () => {
    c.current?.();
  }), [a, l, JSON.stringify(o.offset)]);
  return ao(() => {
    if (d.current = !1, Fa(a) || Fa(l)) {
      d.current = !0;
      return;
    } else
      return h();
  }, [h]), I.useEffect(() => {
    if (!d.current)
      return;
    let m;
    const S = () => {
      const p = Fa(a), v = Fa(l);
      !p && !v && (m = h());
    };
    return Ia.read(S), () => {
      Xp(S), m?.();
    };
  }, [h]), r;
}
function XD(a) {
  const l = Wa(() => un(a)), { isStatic: o } = I.useContext(Rh);
  if (o) {
    const [, r] = I.useState(a);
    I.useEffect(() => l.on("change", r), []);
  }
  return l;
}
function O1(a, l) {
  const o = XD(l()), r = () => o.set(l());
  return r(), ao(() => {
    const c = () => bt.preRender(r, !1, !0), d = a.map((h) => h.on("change", c));
    return () => {
      d.forEach((h) => h()), sn(r);
    };
  }), o;
}
function QD(a) {
  tu.current = [], a();
  const l = O1(tu.current, a);
  return tu.current = void 0, l;
}
function An(a, l, o, r) {
  if (typeof a == "function")
    return QD(a);
  if (o !== void 0 && !Array.isArray(o) && typeof l != "function")
    return ZD(a, l, o, r);
  const h = typeof l == "function" ? l : p2(l, o, r), m = Array.isArray(a) ? Lv(a, h) : Lv([a], ([p]) => h(p)), S = Array.isArray(a) ? void 0 : a.accelerate;
  return S && !S.isTransformed && typeof l != "function" && Array.isArray(o) && r?.clamp !== !1 && (m.accelerate = {
    ...S,
    times: [0, ...l, 1],
    keyframes: [
      o[0],
      ...o,
      o[o.length - 1]
    ],
    isTransformed: !0
  }), m;
}
function Lv(a, l) {
  const o = Wa(() => []);
  return O1(a, () => {
    o.length = 0;
    const r = a.length;
    for (let c = 0; c < r; c++)
      o[c] = a[c].get();
    return l(o);
  });
}
function ZD(a, l, o, r) {
  const c = Wa(() => Object.keys(o)), d = Wa(() => ({}));
  for (const h of c)
    d[h] = An(a, l, o[h], r);
  return d;
}
function KD() {
  !Oh.current && Fp();
  const [a] = I.useState(ho.current);
  return a;
}
function JD({ char: a, index: l, centerIndex: o, scrollYProgress: r }) {
  const c = l - o, d = An(r, [0, 1], [c * 50, 0]), h = An(r, [0, 1], [c * 50, 0]);
  return /* @__PURE__ */ Ut.jsx(Vh.span, { className: a === " " ? "finale-char finale-space" : "finale-char", style: { x: d, rotateX: h }, children: a });
}
function PD({ char: a, index: l, centerIndex: o, scrollYProgress: r }) {
  const c = l - o, d = An(r, [0, 1], [c * 50, 0]), h = An(r, [0, 1], [0.75, 1]), m = An(r, [0, 1], [Math.abs(c) * 50, 0]);
  return /* @__PURE__ */ Ut.jsx(Vh.img, { src: a, alt: "", className: "finale-portrait", style: { x: d, scale: h, y: m, transformOrigin: "center" } });
}
function FD({ char: a, index: l, centerIndex: o, scrollYProgress: r }) {
  const c = l - o, d = An(r, [0, 1], [c * 90, 0]), h = An(r, [0, 1], [c * 50, 0]), m = An(r, [0, 1], [-Math.abs(c) * 20, 0]), S = An(r, [0, 1], [0.75, 1]);
  return /* @__PURE__ */ Ut.jsx(Vh.img, { src: a, alt: "", className: "finale-portrait", style: { x: d, rotate: h, y: m, scale: S, transformOrigin: "center" } });
}
const kD = ["hello", "black-portrait", "rose-pack", "terrier", "trio", "walk"].map((a) => `assets/campaign/${a}.webp`), WD = ["duo", "little-big", "backs", "rest", "icons", "home"].map((a) => `assets/campaign/${a}.webp`);
function ID() {
  const a = I.useRef(null), l = I.useRef(null), o = I.useRef(null), { scrollYProgress: r } = Of({ target: a, offset: ["start end", "center center"] }), { scrollYProgress: c } = Of({ target: l, offset: ["start end", "center center"] }), { scrollYProgress: d } = Of({ target: o, offset: ["start end", "center center"] }), h = KD(), m = "closer to you.".split(""), S = Math.floor(m.length / 2);
  return /* @__PURE__ */ Ut.jsxs("section", { className: `pawlink-finale${h ? " reduced" : ""}`, "aria-label": "A closer connection", children: [
    /* @__PURE__ */ Ut.jsxs("div", { ref: a, className: "finale-block finale-text-block", children: [
      /* @__PURE__ */ Ut.jsx("span", { className: "finale-eyebrow", children: "THEIR WORLD. CLOSER TO YOURS." }),
      /* @__PURE__ */ Ut.jsx("h2", { className: "finale-title", "aria-label": "Closer to you.", children: /* @__PURE__ */ Ut.jsx("span", { "aria-hidden": "true", children: h ? "closer to you." : m.map((p, v) => /* @__PURE__ */ Ut.jsx(JD, { char: p, index: v, centerIndex: S, scrollYProgress: r }, v)) }) })
    ] }),
    /* @__PURE__ */ Ut.jsxs("div", { ref: l, className: "finale-block finale-gather", children: [
      /* @__PURE__ */ Ut.jsx("h3", { children: "Every little personality." }),
      /* @__PURE__ */ Ut.jsx("div", { className: "finale-row", "aria-label": "Six different PawLink dog portraits", children: kD.map((p, v) => h ? /* @__PURE__ */ Ut.jsx("img", { src: p, alt: "", className: "finale-portrait" }, p) : /* @__PURE__ */ Ut.jsx(PD, { char: p, index: v, centerIndex: 3, scrollYProgress: c }, p)) })
    ] }),
    /* @__PURE__ */ Ut.jsxs("div", { ref: o, className: "finale-block finale-rotate", children: [
      /* @__PURE__ */ Ut.jsx("h3", { children: "A whole lot of love." }),
      /* @__PURE__ */ Ut.jsx("div", { className: "finale-row", "aria-label": "Six more PawLink dog portraits", children: WD.map((p, v) => h ? /* @__PURE__ */ Ut.jsx("img", { src: p, alt: "", className: "finale-portrait" }, p) : /* @__PURE__ */ Ut.jsx(FD, { char: p, index: v, centerIndex: 3, scrollYProgress: d }, p)) }),
      /* @__PURE__ */ Ut.jsxs("div", { className: "finale-actions", children: [
        /* @__PURE__ */ Ut.jsx("a", { href: "prototype-03.html#portraits", children: "Explore their world ↗" }),
        /* @__PURE__ */ Ut.jsx("a", { href: "prototype-03.html", children: "Experience the film again ↺" })
      ] })
    ] })
  ] });
}
const jv = document.getElementById("pawlink-finale");
if (jv) {
  const a = Ub.createRoot(jv);
  a.render(/* @__PURE__ */ Ut.jsx(ID, {})), window.addEventListener("pagehide", () => a.unmount(), { once: !0 });
}
