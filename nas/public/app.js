const {
  useState,
  useEffect,
  useMemo
} = React;
const DEFAULT_MAKERS = [{
  id: 'default',
  name: '기본 3단계 (0.7 ➔ 0.9 ➔ 0.95)',
  factor1: '0.7',
  useStep2: true,
  factor2: '0.9',
  useStep3: true,
  factor3: '0.95'
}, {
  id: 'maker_a',
  name: 'A사 (0.65 ➔ 0.9 ➔ 1.0)',
  factor1: '0.65',
  useStep2: true,
  factor2: '0.9',
  useStep3: true,
  factor3: '1.0'
}, {
  id: 'maker_b',
  name: 'B사 1단계만 (0.7)',
  factor1: '0.7',
  useStep2: false,
  factor2: '0.9',
  useStep3: false,
  factor3: '0.95'
}];
const Icon = ({
  d,
  size = 20,
  color = "currentColor"
}) => React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, Array.isArray(d) ? d.map((p, i) => React.createElement("path", {
  key: i,
  d: p
})) : React.createElement("path", {
  d: d
}));
const IconCalculator = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M8 6h8", "M8 10h2", "M8 14h2", "M8 18h2", "M14 10h2", "M14 14h2", "M14 18h2"]
});
const IconFactory = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M2 20V10l5-5 5 5V4l5 5v11H2z", "M9 20v-5h6v5"]
});
const IconCopy = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2", "M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2", "M10 4h4v4h-4z"]
});
const IconCheck = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: "M20 6L9 17l-5-5"
});
const IconRefresh = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M1 4v6h6", "M23 20v-6h-6", "M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"]
});
const IconSettings = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]
});
const IconChevronDown = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: "M6 9l6 6 6-6"
});
const IconChevronUp = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: "M18 15l-6-6-6 6"
});
const IconTrash = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M3 6h18", "M19 6l-1 14H6L5 6", "M8 6V4h8v2", "M10 11v6", "M14 11v6"]
});
const IconPlus = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M12 5v14", "M5 12h14"]
});
const IconMinus = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: "M5 12h14"
});
const IconX = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M18 6L6 18", "M6 6l12 12"]
});
const IconDivide = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M5 12h14", "M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z", "M12 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"]
});
const IconHistory = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M3 3v5h5", "M3.05 13A9 9 0 1 0 6 5.3L3 8", "M12 7v5l3 3"]
});
const IconPercent = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M19 5L5 19", "M6.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "M17.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"]
});
const IconRepeat = ({
  size
}) => React.createElement(Icon, {
  size: size,
  d: ["M17 1l4 4-4 4", "M3 11V9a4 4 0 0 1 4-4h14", "M7 23l-4-4 4-4", "M21 13v2a4 4 0 0 1-4 4H3"]
});
function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [makers, setMakers] = useState(DEFAULT_MAKERS);
  const [catalog, setCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState('');
  const [query, setQuery] = useState('');
  const [makerFilter, setMakerFilter] = useState('');
  const [selection, setSelection] = useState(null);
  const [csrf, setCsrf] = useState('');
  const [applying, setApplying] = useState(false);
  const logout = async () => {
    setCatalog(null);
    setSelection(null);
    setFactoryPrice('');
    setForwardPrice('');
    try {
      await fetch('api.php?action=logout', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrf
        }
      });
    } finally {
      window.location.replace('index.php');
    }
  };
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const status = await fetch('api.php?action=status', {
          cache: 'no-store'
        }).then(r => r.json());
        if (!status.authenticated) {
          window.location.replace('index.php');
          return;
        }
        if (live) setCsrf(status.csrf);
        const response = await fetch('api.php?action=catalog', {
          cache: 'no-store'
        });
        if (response.status === 401) {
          window.location.replace('index.php');
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || '단가표를 불러오지 못했습니다.');
        if (live) setCatalog(data);
      } catch (e) {
        if (live) setCatalogError(e.message);
      }
    })();
    const timer = setTimeout(() => window.location.replace('index.php'), 30 * 60 * 1000);
    const restore = e => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', restore);
    return () => {
      live = false;
      clearTimeout(timer);
      window.removeEventListener('pageshow', restore);
    };
  }, []);
  const normalize = value => String(value || '').toUpperCase().replace(/[\s\-]/g, '');
  const matches = (catalog?.items || []).filter(item => (!makerFilter || item.maker === makerFilter) && normalize([item.model, item.category, item.spec].join(' ')).includes(normalize(query)));
  const applyPrice = async item => {
    setApplying(true);
    try {
      const response = await fetch('api.php?action=status', {
        cache: 'no-store'
      });
      const status = await response.json();
      if (!response.ok || !status.authenticated) {
        window.location.replace('index.php');
        return;
      }
      setSelection(item);
      setSelectedMaker('catalog-direct');
      setFactor1('1');
      setFactor2('1');
      setFactor3('1');
      setUseStep2(false);
      setUseStep3(false);
      setBasePriceType('step1');
      if (item.price_type === 'purchase') {
        setFactoryPrice('');
        setForwardPrice(String(item.price_krw));
      } else {
        setFactoryPrice(String(item.price_krw));
      }
      setActiveTab('forward');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (e) {
      setCatalogError('로그인을 확인하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setApplying(false);
    }
  };
  const formatNumber = num => new Intl.NumberFormat('ko-KR').format(num);
  const parseNum = str => {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '')) || 0;
  };
  const [selectedMaker, setSelectedMaker] = useState('default');
  const [isAddingMaker, setIsAddingMaker] = useState(false);
  const [newMakerName, setNewMakerName] = useState('');
  const [factoryPrice, setFactoryPrice] = useState('');
  const [factor1, setFactor1] = useState('0.7');
  const [factor2, setFactor2] = useState('0.9');
  const [factor3, setFactor3] = useState('0.95');
  const [useStep2, setUseStep2] = useState(true);
  const [useStep3, setUseStep3] = useState(true);
  const [basePriceType, setBasePriceType] = useState('step3');
  const [forwardPrice, setForwardPrice] = useState('');
  const [saveFlash, setSaveFlash] = useState(false);
  const [calcInputCount, setCalcInputCount] = useState(3);
  const [calcInputs, setCalcInputs] = useState(Array(10).fill(''));
  const [calcOperator, setCalcOperator] = useState('+');
  const [calcResult, setCalcResult] = useState(0);
  const [calcPrice, setCalcPrice] = useState('');
  const calcError = useMemo(() => {
    const values = calcInputs.slice(0, calcInputCount).filter(v => v.trim() !== '');
    return calcOperator === '/' && values.slice(1).some(v => parseNum(v) === 0) ? '0으로 나눌 수 없습니다. 나누는 값을 수정해 주세요.' : '';
  }, [calcInputs, calcOperator, calcInputCount]);
  const [copiedRow, setCopiedRow] = useState(null);
  const [roundingMethod, setRoundingMethod] = useState('floor');
  const [roundingUnit, setRoundingUnit] = useState('1');
  const [showHighMargin, setShowHighMargin] = useState(false);
  const [revPurchasePrice, setRevPurchasePrice] = useState('');
  const [revSalesPrice, setRevSalesPrice] = useState('');
  const [converterType, setConverterType] = useState('flow');
  const [flowValues, setFlowValues] = useState({
    m3_h: '',
    m3_min: '',
    l_h: '',
    l_s: '',
    l_min: '',
    cc_h: '',
    cc_min: '',
    cc_s: '',
    gal_h: '',
    gal_min: '',
    gal_s: ''
  });
  const [pressureValues, setPressureValues] = useState({
    m: '',
    bar: '',
    kgf_cm2: '',
    psi: '',
    mpa: '',
    kpa: ''
  });
  const FLOW_RATES = {
    m3_h: 1,
    m3_min: 1 / 60,
    l_h: 1000,
    l_min: 1000 / 60,
    l_s: 1000 / 3600,
    cc_h: 1000000,
    cc_min: 1000000 / 60,
    cc_s: 1000000 / 3600,
    gal_h: 264.172,
    gal_min: 264.172 / 60,
    gal_s: 264.172 / 3600
  };
  const PRESSURE_RATES = {
    bar: 1,
    mpa: 0.1,
    kpa: 100,
    psi: 14.50377,
    kgf_cm2: 1.01972,
    m: 10.19716
  };
  const FLOW_UNITS = [{
    key: 'm3_h',
    label: '㎥/h'
  }, {
    key: 'm3_min',
    label: '㎥/min'
  }, {
    key: 'l_h',
    label: 'ℓ/h'
  }, {
    key: 'l_min',
    label: 'ℓ/min'
  }, {
    key: 'l_s',
    label: 'ℓ/s'
  }, {
    key: 'cc_h',
    label: 'cc/h'
  }, {
    key: 'cc_min',
    label: 'cc/min'
  }, {
    key: 'cc_s',
    label: 'cc/s'
  }, {
    key: 'gal_h',
    label: 'gal/h'
  }, {
    key: 'gal_min',
    label: 'gal/min'
  }, {
    key: 'gal_s',
    label: 'gal/s'
  }];
  const PRESSURE_UNITS = [{
    key: 'm',
    label: 'm (미터)'
  }, {
    key: 'bar',
    label: 'bar'
  }, {
    key: 'kgf_cm2',
    label: 'kgf/c㎡'
  }, {
    key: 'psi',
    label: 'psi'
  }, {
    key: 'mpa',
    label: 'MPa'
  }, {
    key: 'kpa',
    label: 'kPa'
  }];
  useEffect(() => {
    try {
      const saved = localStorage.getItem('calculatorMakers');
      if (saved) setMakers(JSON.parse(saved));
    } catch (e) {}
  }, []);
  useEffect(() => {
    const numFactory = parseNum(factoryPrice);
    const f1 = parseFloat(factor1) || 0;
    const f2 = parseFloat(factor2) || 0;
    const f3 = parseFloat(factor3) || 0;
    const s1 = Math.round(numFactory * f1);
    const s2 = useStep2 ? Math.round(s1 * f2) : s1;
    const s3 = useStep2 && useStep3 ? Math.round(s2 * f3) : s2;
    let targetPrice = s3;
    if (basePriceType === 'step1') targetPrice = s1;else if (basePriceType === 'step2') targetPrice = s2;
    if (numFactory > 0) setForwardPrice(targetPrice.toString());else if (!(selection?.price_type === 'purchase' && selectedMaker === 'catalog-direct')) setForwardPrice('');
  }, [factoryPrice, factor1, factor2, factor3, useStep2, useStep3, basePriceType]);
  useEffect(() => {
    if (calcError) {
      setCalcResult(null);
      setCalcPrice('');
      return;
    }
    const validInputs = calcInputs.slice(0, calcInputCount).filter(v => v.trim() !== '');
    if (validInputs.length === 0) {
      setCalcResult(0);
      setCalcPrice('');
      return;
    }
    const validNums = validInputs.map(v => parseNum(v));
    let res = validNums[0];
    for (let i = 1; i < validNums.length; i++) {
      const next = validNums[i];
      if (calcOperator === '+') res += next;else if (calcOperator === '-') res -= next;else if (calcOperator === '*') res *= next;else if (calcOperator === '/') res /= next;
    }
    const roundedRes = Math.round(res);
    setCalcResult(roundedRes);
    setCalcPrice(roundedRes.toString());
  }, [calcInputs, calcOperator, calcInputCount, calcError]);
  const handlePriceChange = (e, setter) => setter(e.target.value.replace(/[^\d]/g, ''));
  const handleFactorChange = (e, setter) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
    setter(val);
  };
  const formatConvertedValue = val => {
    if (val === 0) return '0';
    let str = Number(val.toPrecision(7)).toString();
    if (str.includes('e')) str = val.toFixed(8).replace(/\.?0+$/, '');
    return str;
  };
  const handleUnitChange = (type, unitKey, rawValue) => {
    let value = rawValue.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
    if (type === 'flow') {
      if (value === '') {
        setFlowValues({
          m3_h: '',
          m3_min: '',
          l_h: '',
          l_s: '',
          l_min: '',
          cc_h: '',
          cc_min: '',
          cc_s: '',
          gal_h: '',
          gal_min: '',
          gal_s: ''
        });
        return;
      }
      const numValue = parseFloat(value);
      const newValues = {
        ...flowValues,
        [unitKey]: value
      };
      if (!isNaN(numValue)) {
        const baseValue = numValue / FLOW_RATES[unitKey];
        for (const k in FLOW_RATES) if (k !== unitKey) newValues[k] = formatConvertedValue(baseValue * FLOW_RATES[k]);
      } else {
        for (const k in FLOW_RATES) if (k !== unitKey) newValues[k] = '';
      }
      setFlowValues(newValues);
    } else {
      if (value === '') {
        setPressureValues({
          m: '',
          bar: '',
          kgf_cm2: '',
          psi: '',
          mpa: '',
          kpa: ''
        });
        return;
      }
      const numValue = parseFloat(value);
      const newValues = {
        ...pressureValues,
        [unitKey]: value
      };
      if (!isNaN(numValue)) {
        const baseValue = numValue / PRESSURE_RATES[unitKey];
        for (const k in PRESSURE_RATES) if (k !== unitKey) newValues[k] = formatConvertedValue(baseValue * PRESSURE_RATES[k]);
      } else {
        for (const k in PRESSURE_RATES) if (k !== unitKey) newValues[k] = '';
      }
      setPressureValues(newValues);
    }
  };
  const resetConverter = () => {
    if (converterType === 'flow') setFlowValues({
      m3_h: '',
      m3_min: '',
      l_h: '',
      l_s: '',
      l_min: '',
      cc_h: '',
      cc_min: '',
      cc_s: '',
      gal_h: '',
      gal_min: '',
      gal_s: ''
    });else setPressureValues({
      m: '',
      bar: '',
      kgf_cm2: '',
      psi: '',
      mpa: '',
      kpa: ''
    });
  };
  const saveNewMaker = () => {
    if (!newMakerName.trim()) return;
    const newMaker = {
      id: Date.now().toString(),
      name: newMakerName,
      factor1,
      factor2,
      factor3,
      useStep2,
      useStep3
    };
    const updated = [...makers, newMaker];
    setMakers(updated);
    localStorage.setItem('calculatorMakers', JSON.stringify(updated));
    setSelectedMaker(newMaker.id);
    setIsAddingMaker(false);
    setNewMakerName('');
  };
  const updateCurrentMaker = () => {
    if (selectedMaker === 'catalog-direct') return;
    const updated = makers.map(m => m.id === selectedMaker ? {
      ...m,
      factor1,
      factor2,
      factor3,
      useStep2,
      useStep3
    } : m);
    setMakers(updated);
    localStorage.setItem('calculatorMakers', JSON.stringify(updated));
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  };
  const deleteMaker = () => {
    if (makers.length <= 1 || selectedMaker === 'catalog-direct') return;
    const updated = makers.filter(m => m.id !== selectedMaker);
    setMakers(updated);
    localStorage.setItem('calculatorMakers', JSON.stringify(updated));
    const first = updated[0];
    setSelectedMaker(first.id);
    setFactor1(first.factor1);
    setFactor2(first.factor2);
    setFactor3(first.factor3);
    setUseStep2(first.useStep2 !== false);
    setUseStep3(first.useStep2 !== false && first.useStep3 !== false);
  };
  const handleCopy = (price, index) => {
    const ta = document.createElement("textarea");
    ta.value = price.toString();
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      setCopiedRow(index);
      setTimeout(() => setCopiedRow(null), 1500);
    } catch (e) {}
    document.body.removeChild(ta);
  };
  const rows = useMemo(() => {
    const activePrice = activeTab === 'forward' ? forwardPrice : calcPrice;
    const numericPrice = parseNum(activePrice);
    if (!numericPrice || activeTab === 'calc' && calcError) return [];
    const res = [];
    for (let i = 1; i <= 100; i++) {
      const multiplier = (100 + i) / 100;
      const unit = parseInt(roundingUnit, 10);
      const scaledPrice = numericPrice * (100 + i) / (100 * unit);
      const sellingPrice = Math[roundingMethod](scaledPrice) * unit;
      res.push({
        index: i,
        multiplier: multiplier.toFixed(2),
        marginRate: i,
        sellingPrice,
        profit: sellingPrice - numericPrice
      });
    }
    return res;
  }, [forwardPrice, calcPrice, activeTab, roundingUnit, roundingMethod, calcError]);
  const currentActivePriceDisplay = activeTab === 'forward' ? forwardPrice : calcPrice;
  return React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: '#f1f5f9',
      paddingBottom: '3rem'
    }
  }, React.createElement("header", {
    style: {
      background: 'white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }
  }, React.createElement("div", {
    style: {
      maxWidth: '56rem',
      margin: '0 auto',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }
  }, React.createElement("div", {
    style: {
      background: '#2563eb',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      display: 'flex'
    }
  }, React.createElement(IconCalculator, {
    size: 24
  })), React.createElement("h1", {
    style: {
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#1e293b'
    }
  }, "\uB2E8\uAC00 \uACC4\uC0B0\uAE30 Pro ", React.createElement("small", {
    style: {
      fontSize: "0.65rem",
      color: "#64748b"
    }
  }, "\uC0AC\uB0B4\uC6A9 v0.1.0")), React.createElement("button", {
    className: "btn-outline",
    style: {
      marginLeft: "auto"
    },
    onClick: logout
  }, "\uC7A0\uAE08")), React.createElement("div", {
    style: {
      maxWidth: '56rem',
      margin: '0 auto',
      display: 'flex',
      overflowX: 'auto',
      padding: '0 1rem',
      borderBottom: '1px solid #e2e8f0'
    }
  }, [{
    id: 'catalog',
    label: '단가표 검색',
    Icon: IconFactory
  }, {
    id: 'forward',
    label: '단가/견적',
    Icon: IconCalculator
  }, {
    id: 'reverse',
    label: '과거역산',
    Icon: IconHistory
  }, {
    id: 'calc',
    label: '사칙연산',
    Icon: IconPlus
  }, {
    id: 'converter',
    label: '단위환산',
    Icon: IconRepeat
  }].map(tab => React.createElement("button", {
    key: tab.id,
    onClick: () => {
      setActiveTab(tab.id);
      setCopiedRow(null);
    },
    style: {
      flex: 1,
      minWidth: '80px',
      padding: '0.75rem 0.25rem',
      fontSize: '0.85rem',
      fontWeight: 700,
      borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
      color: activeTab === tab.id ? '#2563eb' : '#64748b',
      background: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      cursor: 'pointer',
      transition: 'all 0.15s',
      border: 'none',
      whiteSpace: 'nowrap'
    }
  }, React.createElement(tab.Icon, {
    size: 16
  }), tab.label)))), React.createElement("main", {
    style: {
      maxWidth: '56rem',
      margin: '0 auto',
      padding: '0 1rem',
      marginTop: '1.5rem'
    }
  }, activeTab === 'catalog' && React.createElement("section", {
    style: {
      background: 'white',
      padding: '1.25rem',
      borderRadius: '1rem'
    }
  }, React.createElement("h2", {
    style: {
      marginBottom: '0.75rem'
    }
  }, "\uBE44\uACF5\uAC1C \uB2E8\uAC00\uD45C \uAC80\uC0C9"), React.createElement("p", {
    style: {
      color: '#64748b',
      marginBottom: '1rem'
    }
  }, "\uC0AC\uC591\uC744 \uD655\uC778\uD55C \uB4A4 \uAC00\uACA9\uC744 \uB204\uB974\uBA74 \uACC4\uC0B0\uAE30\uC5D0 \uC801\uC6A9\uB429\uB2C8\uB2E4. \uAE08\uC561\uC740 \uC6D0 \uB2E8\uC704 \xB7 \uBD80\uAC00\uC138 \uBCC4\uB3C4\uC785\uB2C8\uB2E4."), catalog?.demo && React.createElement("p", {
    role: "status",
    style: {
      color: '#b45309',
      padding: '0.75rem',
      background: '#fffbeb',
      marginBottom: '1rem'
    }
  }, "\uAC00\uC0C1 \uC0D8\uD50C\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uACAC\uC801\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uB9C8\uC138\uC694."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }
  }, React.createElement("select", {
    "aria-label": "\uC5C5\uCCB4",
    value: makerFilter,
    onChange: e => setMakerFilter(e.target.value),
    className: "btn-outline"
  }, React.createElement("option", {
    value: ""
  }, "\uC804\uCCB4 \uC5C5\uCCB4"), ['두크', '두성', '대아', '왈러스'].map(m => React.createElement("option", {
    key: m
  }, m)), [...new Set((catalog?.items || []).map(i => i.maker))].filter(m => !['두크', '두성', '대아', '왈러스'].includes(m)).map(m => React.createElement("option", {
    key: m
  }, m))), React.createElement("input", {
    "aria-label": "\uBAA8\uB378 \uBC0F \uC0AC\uC591 \uAC80\uC0C9",
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "\uBAA8\uB378\uBA85 \uB610\uB294 \uC0AC\uC591 \uAC80\uC0C9",
    style: {
      flex: 1,
      minWidth: 150,
      padding: '0.8rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem'
    }
  })), catalogError && React.createElement("p", {
    role: "alert",
    style: {
      color: '#dc2626',
      marginTop: '1rem'
    }
  }, catalogError), !catalog && !catalogError && React.createElement("p", {
    style: {
      padding: '1rem'
    }
  }, "\uB2E8\uAC00\uD45C\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4."), catalog && React.createElement("p", {
    style: {
      padding: '0.75rem 0',
      color: '#64748b'
    }
  }, "\uAC80\uC0C9 \uACB0\uACFC ", matches.length, "\uAC74 \xB7 \uAC1C\uC815 ", catalog.revision || '-', matches.length > 100 ? ' · 처음 100건 표시, 검색어를 좁혀 주세요.' : ''), matches.slice(0, 100).map(item => React.createElement("article", {
    key: item.id,
    style: {
      border: '1px solid #e2e8f0',
      padding: '1rem',
      borderRadius: '0.75rem',
      marginBottom: '0.75rem'
    }
  }, React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b'
    }
  }, item.maker, " \xB7 ", item.category, " \xB7 ", item.effective_date, " \xB7 \uC6D0\uBCF8 ", item.source_page || '-', "\uCABD"), React.createElement("h3", {
    style: {
      margin: '0.4rem 0'
    }
  }, item.model), React.createElement("div", null, item.spec), React.createElement("button", {
    disabled: item.status !== 'available' || applying,
    onClick: () => applyPrice(item),
    className: "btn-primary",
    style: {
      marginTop: '0.75rem',
      opacity: item.status === 'available' ? 1 : 0.5
    }
  }, item.status === 'available' ? `${formatNumber(item.price_krw)}원 적용` : item.status === 'inquiry' ? '본사 문의' : '가격 미등록'))), catalog && !matches.length && React.createElement("p", {
    style: {
      padding: '1rem'
    }
  }, "\uC77C\uCE58\uD558\uB294 \uBAA8\uB378\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")), selection && activeTab === 'forward' && React.createElement("aside", {
    style: {
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      padding: '1rem',
      borderRadius: '0.75rem',
      marginBottom: '1rem'
    }
  }, React.createElement("strong", null, selection.maker, " \xB7 ", selection.model), React.createElement("div", null, selection.spec), React.createElement("div", null, selection.price_type === 'list' ? '공장도가/정가' : '매입가', " ", formatNumber(selection.price_krw), "\uC6D0 \xB7 VAT \uBCC4\uB3C4 \xB7 ", selection.effective_date, " \xB7 ", selection.source_page, "\uCABD"), React.createElement("p", {
    style: {
      marginTop: '0.5rem',
      color: '#9a3412'
    }
  }, "\uD560\uC778\uACC4\uC218\uB97C 1\uB85C \uCD08\uAE30\uD654\uD588\uC2B5\uB2C8\uB2E4. \uD574\uB2F9 \uC5C5\uCCB4\uC758 \uB9E4\uC785\uC870\uAC74\uC744 \uC120\uD0DD\xB7\uD655\uC778\uD574 \uC8FC\uC138\uC694."), React.createElement("button", {
    className: "btn-outline",
    onClick: () => setActiveTab('catalog'),
    style: {
      marginTop: '0.5rem'
    }
  }, "\uB2E4\uC2DC \uAC80\uC0C9")), activeTab === 'forward' && React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }
  }, React.createElement("section", {
    style: {
      background: 'white',
      borderRadius: '1rem',
      border: '1px solid #e0e7ff',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      background: '#eef2ff',
      borderBottom: '1px solid #e0e7ff',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#3730a3'
    }
  }, React.createElement(IconFactory, {
    size: 20
  }), " ", React.createElement("h2", {
    style: {
      fontWeight: 700
    }
  }, "1. \uD560\uC778\uACC4\uC218 \uC801\uC6A9 (\uB9E4\uC785\uAC00 \uC0B0\uCD9C)")), React.createElement("div", {
    style: {
      padding: '1.25rem'
    }
  }, React.createElement("div", {
    style: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      padding: '0.75rem',
      marginBottom: '1.5rem',
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }
  }, isAddingMaker ? React.createElement(React.Fragment, null, React.createElement("input", {
    type: "text",
    value: newMakerName,
    onChange: e => setNewMakerName(e.target.value),
    placeholder: "\uD504\uB9AC\uC14B \uC774\uB984",
    style: {
      flex: 1,
      padding: '0.5rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem'
    }
  }), React.createElement("button", {
    onClick: saveNewMaker,
    className: "btn-primary"
  }, "\uC800\uC7A5"), React.createElement("button", {
    onClick: () => setIsAddingMaker(false),
    className: "btn-outline"
  }, "\uCDE8\uC18C")) : React.createElement(React.Fragment, null, React.createElement("select", {
    value: selectedMaker,
    onChange: e => {
      const m = makers.find(mk => mk.id === e.target.value);
      if (m) {
        setSelectedMaker(m.id);
        setFactor1(m.factor1);
        setFactor2(m.factor2);
        setFactor3(m.factor3);
        setUseStep2(m.useStep2 !== false);
        setUseStep3(m.useStep2 !== false && m.useStep3 !== false);
      }
    },
    style: {
      flex: 1,
      padding: '0.5rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem',
      fontWeight: 600
    }
  }, React.createElement("option", {
    value: "catalog-direct",
    disabled: true
  }, "\uB2E8\uAC00\uD45C \uC801\uC6A9 \xB7 \uD560\uC778\uACC4\uC218 \uD655\uC778 \uD544\uC694"), makers.map(m => React.createElement("option", {
    key: m.id,
    value: m.id
  }, m.name))), React.createElement("button", {
    onClick: updateCurrentMaker,
    style: {
      background: saveFlash ? '#10b981' : '#d1fae5',
      color: saveFlash ? 'white' : '#047857',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer'
    }
  }, saveFlash ? '저장됨' : '덮어쓰기'), React.createElement("button", {
    onClick: () => setIsAddingMaker(true),
    style: {
      background: '#e0e7ff',
      color: '#4f46e5',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer'
    }
  }, "\uC2E0\uADDC\uC800\uC7A5"), React.createElement("button", {
    onClick: deleteMaker,
    title: "\uD604\uC7AC \uD504\uB9AC\uC14B \uC0AD\uC81C",
    style: {
      padding: '0.5rem',
      color: '#ef4444',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, React.createElement(IconTrash, {
    size: 18
  })))), React.createElement("div", {
    style: {
      marginBottom: '1.5rem'
    }
  }, React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#475569',
      marginBottom: '0.5rem'
    }
  }, "\uB2E8\uAC00\uD45C \uC815\uAC00 (List Price)"), React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, React.createElement("input", {
    type: "text",
    value: factoryPrice ? formatNumber(factoryPrice) : '',
    onChange: e => handlePriceChange(e, setFactoryPrice),
    style: {
      width: '100%',
      fontSize: '1.5rem',
      fontWeight: 700,
      textAlign: 'right',
      padding: '0.75rem 3rem 0.75rem 1rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.75rem',
      outline: 'none'
    }
  }), React.createElement("span", {
    style: {
      position: 'absolute',
      right: '1rem',
      color: '#64748b',
      fontWeight: 700
    }
  }, "\uC6D0"))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '0.75rem'
    }
  }, [{
    id: 'step1',
    label: '1차: 대리점가',
    val: Math.round(parseNum(factoryPrice) * (parseFloat(factor1) || 0)),
    factor: factor1,
    setFactor: setFactor1,
    use: true
  }, {
    id: 'step2',
    label: '2차: 매입원가',
    val: Math.round(Math.round(parseNum(factoryPrice) * (parseFloat(factor1) || 0)) * (parseFloat(factor2) || 0)),
    factor: factor2,
    setFactor: setFactor2,
    use: useStep2,
    setUse: v => {
      setUseStep2(v);
      if (!v) {
        setUseStep3(false);
        setBasePriceType('step1');
      }
    }
  }, {
    id: 'step3',
    label: '3차: 실매입가',
    val: Math.round(Math.round(Math.round(parseNum(factoryPrice) * (parseFloat(factor1) || 0)) * (parseFloat(factor2) || 0)) * (parseFloat(factor3) || 0)),
    factor: factor3,
    setFactor: setFactor3,
    use: useStep3,
    setUse: v => {
      setUseStep3(v);
      if (!v && basePriceType === 'step3') setBasePriceType('step2');
    },
    parent: useStep2
  }].map(step => React.createElement("div", {
    key: step.id,
    onClick: () => step.use && setBasePriceType(step.id),
    style: {
      padding: '1rem',
      borderRadius: '0.75rem',
      border: basePriceType === step.id ? '2px solid #818cf8' : '1px solid #e2e8f0',
      background: basePriceType === step.id ? '#eef2ff' : '#f8fafc',
      opacity: step.use ? 1 : 0.5,
      cursor: 'pointer',
      transition: 'all 0.15s'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem'
    }
  }, React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: 700
    },
    onClick: e => e.stopPropagation()
  }, step.setUse && React.createElement("input", {
    type: "checkbox",
    checked: step.use,
    disabled: step.parent === false,
    onChange: e => step.setUse(e.target.checked)
  }), " ", step.label)), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem'
    }
  }, React.createElement("span", {
    style: {
      fontSize: '0.875rem'
    }
  }, "\xD7"), React.createElement("input", {
    type: "text",
    value: step.factor,
    disabled: !step.use,
    onChange: e => handleFactorChange(e, step.setFactor),
    onClick: e => e.stopPropagation(),
    style: {
      width: '4rem',
      textAlign: 'center',
      border: '1px solid #cbd5e1',
      borderRadius: '0.375rem',
      padding: '0.25rem',
      fontWeight: 700
    }
  })), React.createElement("div", {
    style: {
      fontSize: '1.125rem',
      fontWeight: 700,
      textAlign: 'right'
    }
  }, formatNumber(step.val), "\uC6D0"))))))), activeTab === 'reverse' && React.createElement("section", {
    style: {
      background: 'white',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      padding: '1.5rem'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    }
  }, React.createElement(IconPercent, {
    size: 20
  }), " ", React.createElement("h2", {
    style: {
      fontWeight: 700
    }
  }, "\uACFC\uAC70 \uD310\uB9E4 \uAE30\uB85D \uC5ED\uC0B0")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    }
  }, React.createElement("div", null, React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#475569',
      marginBottom: '0.5rem'
    }
  }, "\uC2E4\uC81C \uB9E4\uC785\uAC00 (\uB2E8\uAC00)"), React.createElement("input", {
    type: "text",
    value: revPurchasePrice ? formatNumber(revPurchasePrice) : '',
    onChange: e => handlePriceChange(e, setRevPurchasePrice),
    style: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem',
      textAlign: 'right',
      fontSize: '1.2rem',
      fontWeight: 700
    }
  })), React.createElement("div", null, React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#475569',
      marginBottom: '0.5rem'
    }
  }, "\uCD5C\uC885 \uD310\uB9E4\uAC00 (\uACAC\uC801\uAC00)"), React.createElement("input", {
    type: "text",
    value: revSalesPrice ? formatNumber(revSalesPrice) : '',
    onChange: e => handlePriceChange(e, setRevSalesPrice),
    style: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem',
      textAlign: 'right',
      fontSize: '1.2rem',
      fontWeight: 700
    }
  }))), parseNum(revPurchasePrice) > 0 && parseNum(revSalesPrice) > 0 ? React.createElement("div", {
    style: {
      background: '#eff6ff',
      padding: '1.5rem',
      borderRadius: '1rem',
      border: '1px solid #bfdbfe'
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      textAlign: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: '#1e40af'
    }
  }, "\uC774\uC775\uAE08"), React.createElement("div", {
    style: {
      fontSize: '1.25rem',
      fontWeight: 800
    }
  }, formatNumber(parseNum(revSalesPrice) - parseNum(revPurchasePrice)), "\uC6D0")), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: '#1e40af'
    }
  }, "\uBC30\uC218"), React.createElement("div", {
    style: {
      fontSize: '1.25rem',
      fontWeight: 800
    }
  }, "x", (parseNum(revSalesPrice) / parseNum(revPurchasePrice)).toFixed(3))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: '#1e40af'
    }
  }, "\uAC00\uC0B0\uC728"), React.createElement("div", {
    style: {
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#2563eb'
    }
  }, ((parseNum(revSalesPrice) / parseNum(revPurchasePrice) - 1) * 100).toFixed(2), "%")))) : React.createElement("div", {
    style: {
      textAlign: 'center',
      color: '#94a3b8',
      padding: '2rem',
      border: '2px dashed #e2e8f0',
      borderRadius: '1rem'
    }
  }, "\uB9E4\uC785\uAC00\uC640 \uD310\uB9E4\uAC00\uB97C \uC785\uB825\uD558\uBA74 \uAC00\uC0B0\uC728\uC774 \uACC4\uC0B0\uB429\uB2C8\uB2E4."), React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '1rem'
    }
  }, React.createElement("button", {
    onClick: () => {
      setRevPurchasePrice('');
      setRevSalesPrice('');
    },
    style: {
      color: '#ef4444',
      fontSize: '0.875rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, React.createElement(IconRefresh, {
    size: 16
  }), " \uCD08\uAE30\uD654"))), activeTab === 'calc' && React.createElement("section", {
    style: {
      background: 'white',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      padding: '1.25rem',
      marginBottom: '1.5rem'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
      color: '#1e293b'
    }
  }, React.createElement(IconPlus, {
    size: 20
  }), " ", React.createElement("h2", {
    style: {
      fontWeight: 700
    }
  }, "\uC0AC\uCE59\uC5F0\uC0B0 \uB9E4\uC785\uAC00 \uACC4\uC0B0")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '0.75rem',
      marginBottom: '1rem'
    }
  }, calcInputs.slice(0, calcInputCount).map((val, idx) => React.createElement("div", {
    key: idx,
    style: {
      position: 'relative'
    }
  }, React.createElement("input", {
    type: "text",
    value: val ? formatNumber(val) : '',
    onChange: e => {
      const next = [...calcInputs];
      next[idx] = e.target.value.replace(/[^\d]/g, '');
      setCalcInputs(next);
    },
    placeholder: `금액 ${idx + 1}`,
    style: {
      width: '100%',
      padding: '0.6rem 2rem 0.6rem 0.75rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem',
      textAlign: 'right',
      fontSize: '0.9rem',
      fontWeight: 600
    }
  }), React.createElement("span", {
    style: {
      position: 'absolute',
      right: '0.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '0.75rem',
      color: '#94a3b8'
    }
  }, "\uC6D0"))), calcInputCount < 10 && React.createElement("button", {
    onClick: () => setCalcInputCount(prev => prev + 1),
    style: {
      border: '2px dashed #cbd5e1',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      background: 'none',
      cursor: 'pointer',
      minHeight: '2.6rem'
    }
  }, React.createElement(IconPlus, {
    size: 20
  }))), React.createElement("div", {
    style: {
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.25rem',
      background: '#e2e8f0',
      padding: '0.25rem',
      borderRadius: '0.5rem'
    }
  }, [{
    op: '+',
    Icon: IconPlus
  }, {
    op: '-',
    Icon: IconMinus
  }, {
    op: '*',
    Icon: IconX
  }, {
    op: '/',
    Icon: IconDivide
  }].map(item => React.createElement("button", {
    key: item.op,
    onClick: () => setCalcOperator(item.op),
    style: {
      width: '2.5rem',
      height: '2.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.375rem',
      background: calcOperator === item.op ? '#2563eb' : 'transparent',
      color: calcOperator === item.op ? 'white' : '#64748b',
      transition: 'all 0.15s',
      border: 'none',
      cursor: 'pointer'
    }
  }, React.createElement(item.Icon, {
    size: 18
  })))), React.createElement("button", {
    onClick: () => {
      setCalcInputs(Array(10).fill(''));
      setCalcResult(0);
      setCalcInputCount(3);
      setCalcPrice('');
    },
    style: {
      color: '#ef4444',
      fontSize: '0.875rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, React.createElement(IconRefresh, {
    size: 16
  }), " \uCD08\uAE30\uD654")), React.createElement("div", {
    style: {
      background: 'white',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid #e2e8f0',
      minWidth: 0
    }
  }, React.createElement("span", {
    style: {
      fontSize: '0.875rem',
      color: '#64748b',
      flexShrink: 0
    }
  }, "\uD569\uC0B0 \uACB0\uACFC"), React.createElement("span", {
    style: {
      fontSize: '1.5rem',
      fontWeight: 800,
      color: '#1e293b',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, calcError ? '계산 불가' : `${formatNumber(calcResult)}원`))), calcError && React.createElement("p", {
    role: "alert",
    style: {
      marginTop: '0.75rem',
      color: '#dc2626',
      fontSize: '0.9rem',
      fontWeight: 600
    }
  }, calcError)), activeTab === 'converter' && React.createElement("section", {
    style: {
      background: 'white',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      padding: '1.5rem'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, React.createElement(IconRepeat, {
    size: 20
  }), " ", React.createElement("h2", {
    style: {
      fontWeight: 700,
      color: '#1e293b'
    }
  }, "\uB2E8\uC704 \uD658\uC0B0")), React.createElement("button", {
    onClick: resetConverter,
    style: {
      color: '#ef4444',
      fontSize: '0.85rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, React.createElement(IconRefresh, {
    size: 16
  }), " \uCD08\uAE30\uD654")), React.createElement("div", {
    className: "mobile-tabs"
  }, React.createElement("button", {
    onClick: () => setConverterType('flow'),
    style: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 700,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: converterType === 'flow' ? 'white' : 'transparent',
      color: converterType === 'flow' ? '#2563eb' : '#64748b',
      boxShadow: converterType === 'flow' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
    }
  }, "\uC720\uB7C9"), React.createElement("button", {
    onClick: () => setConverterType('pressure'),
    style: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 700,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: converterType === 'pressure' ? 'white' : 'transparent',
      color: converterType === 'pressure' ? '#2563eb' : '#64748b',
      boxShadow: converterType === 'pressure' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
    }
  }, "\uC555\uB825")), React.createElement("div", {
    className: "converter-wrapper"
  }, React.createElement("div", {
    className: `converter-panel ${converterType === 'flow' ? 'active' : ''}`
  }, React.createElement("h3", {
    className: "panel-title"
  }, "\uC720\uB7C9 (Flow Rate)"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '0.75rem'
    }
  }, FLOW_UNITS.map(item => React.createElement("div", {
    key: item.key,
    className: "converter-input transition-all",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem',
      background: 'white'
    }
  }, React.createElement("input", {
    type: "text",
    inputMode: "decimal",
    value: flowValues[item.key],
    onChange: e => handleUnitChange('flow', item.key, e.target.value),
    placeholder: "0",
    style: {
      flex: 1,
      textAlign: 'right',
      padding: '0',
      border: 'none',
      outline: 'none',
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#2563eb',
      background: 'transparent',
      width: '100%'
    }
  }), React.createElement("label", {
    style: {
      fontWeight: 700,
      color: '#475569',
      width: '70px',
      textAlign: 'left',
      flexShrink: 0,
      fontSize: '0.95rem'
    }
  }, item.label)))), React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#64748b',
      marginTop: '1rem',
      textAlign: 'center'
    }
  }, "* 1 \u33A5/h = ", React.createElement("strong", null, "264.172 gal/h"), " (\uBBF8\uAD6D \uC561\uCCB4 \uAC24\uB7F0 \uAE30\uC900)")), React.createElement("div", {
    className: `converter-panel ${converterType === 'pressure' ? 'active' : ''}`
  }, React.createElement("h3", {
    className: "panel-title"
  }, "\uC555\uB825 (Pressure)"), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '0.75rem'
    }
  }, PRESSURE_UNITS.map(item => React.createElement("div", {
    key: item.key,
    className: "converter-input transition-all",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem',
      background: 'white'
    }
  }, React.createElement("input", {
    type: "text",
    inputMode: "decimal",
    value: pressureValues[item.key],
    onChange: e => handleUnitChange('pressure', item.key, e.target.value),
    placeholder: "0",
    style: {
      flex: 1,
      textAlign: 'right',
      padding: '0',
      border: 'none',
      outline: 'none',
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#2563eb',
      background: 'transparent',
      width: '100%'
    }
  }), React.createElement("label", {
    style: {
      fontWeight: 700,
      color: '#475569',
      width: '70px',
      textAlign: 'left',
      flexShrink: 0,
      fontSize: '0.95rem'
    }
  }, item.label))))))), (activeTab === 'forward' || activeTab === 'calc') && React.createElement("section", {
    style: {
      marginTop: '1.5rem'
    }
  }, React.createElement("div", {
    style: {
      background: 'white',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      padding: '1.25rem',
      marginBottom: '1rem'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    }
  }, React.createElement("h3", {
    style: {
      fontWeight: 700,
      color: '#475569'
    }
  }, "2. \uAC00\uC0B0\uC728\uBCC4 \uD310\uB9E4 \uB2E8\uAC00\uD45C"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#475569',
      background: '#f1f5f9',
      padding: '0.4rem 0.75rem',
      borderRadius: '0.5rem'
    }
  }, React.createElement(IconSettings, {
    size: 14
  }), " ", React.createElement("span", null, "\uAE08\uC561 \uCC98\uB9AC:"), React.createElement("select", {
    value: roundingMethod,
    onChange: e => setRoundingMethod(e.target.value),
    style: {
      background: 'transparent',
      fontWeight: 700,
      outline: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#1e293b'
    }
  }, React.createElement("option", {
    value: "floor"
  }, "\uC808\uC0AC(\uBC84\uB9BC)"), React.createElement("option", {
    value: "round"
  }, "\uBC18\uC62C\uB9BC"), React.createElement("option", {
    value: "ceil"
  }, "\uC62C\uB9BC")), React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "|"), React.createElement("select", {
    value: roundingUnit,
    onChange: e => setRoundingUnit(e.target.value),
    style: {
      background: 'transparent',
      fontWeight: 700,
      outline: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#1e293b'
    }
  }, React.createElement("option", {
    value: "1"
  }, "1\uC6D0"), React.createElement("option", {
    value: "10"
  }, "10\uC6D0"), React.createElement("option", {
    value: "100"
  }, "100\uC6D0"), React.createElement("option", {
    value: "1000"
  }, "1,000\uC6D0"), React.createElement("option", {
    value: "10000"
  }, "10,000\uC6D0")))), React.createElement("div", {
    className: "converter-input transition-all",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.25rem',
      background: '#f8fafc',
      borderRadius: '0.75rem',
      border: '1px solid #cbd5e1'
    }
  }, React.createElement("div", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: '#475569'
    }
  }, "\uB2E8\uAC00\uD45C \uAE30\uC900 \uAE08\uC561 (\uB9E4\uC785\uAC00) \uC9C1\uC811 \uC785\uB825"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end'
    }
  }, React.createElement("input", {
    type: "text",
    inputMode: "numeric",
    disabled: activeTab === 'calc' && !!calcError,
    value: currentActivePriceDisplay ? formatNumber(currentActivePriceDisplay) : '',
    onChange: e => {
      const val = e.target.value.replace(/[^\d]/g, '');
      if (activeTab === 'forward') setForwardPrice(val);else if (activeTab === 'calc') setCalcPrice(val);
    },
    placeholder: "0",
    style: {
      fontSize: '1.8rem',
      fontWeight: 800,
      textAlign: 'right',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#1e293b',
      width: '100%',
      maxWidth: '250px'
    }
  }), React.createElement("span", {
    style: {
      fontSize: '1rem',
      color: '#64748b',
      marginLeft: '0.5rem',
      fontWeight: 600
    }
  }, "\uC6D0 \uAE30\uC900")))), parseNum(currentActivePriceDisplay) > 0 && !(activeTab === 'calc' && calcError) && React.createElement("div", {
    style: {
      background: 'white',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }
  }, React.createElement("div", {
    style: {
      maxHeight: '60vh',
      overflowY: 'auto'
    }
  }, React.createElement("table", null, React.createElement("thead", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: '#f1f5f9'
    }
  }, React.createElement("tr", null, React.createElement("th", {
    style: {
      textAlign: 'center'
    }
  }, "\uBC30\uC218"), React.createElement("th", {
    style: {
      textAlign: 'center'
    }
  }, "\uAC00\uC0B0\uC728"), React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\uD310\uB9E4 \uB2E8\uAC00"), React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\uC774\uC775"), React.createElement("th", {
    style: {
      textAlign: 'center'
    }
  }, "\uBCF5\uC0AC"))), React.createElement("tbody", null, rows.filter(r => showHighMargin || r.marginRate <= 50).map(row => React.createElement("tr", {
    key: row.index,
    style: {
      background: row.marginRate % 10 === 0 ? '#f8fafc' : 'white'
    }
  }, React.createElement("td", {
    style: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: '0.85rem'
    }
  }, "x", row.multiplier), React.createElement("td", {
    style: {
      textAlign: 'center',
      fontWeight: 700,
      color: row.marginRate >= 30 ? '#ef4444' : '#1e293b'
    }
  }, row.marginRate, "%"), React.createElement("td", {
    style: {
      textAlign: 'right',
      fontWeight: 800,
      color: '#1e293b',
      fontSize: '1.1rem'
    }
  }, formatNumber(row.sellingPrice)), React.createElement("td", {
    style: {
      textAlign: 'right',
      color: '#16a34a',
      fontSize: '0.9rem'
    }
  }, "+", formatNumber(row.profit)), React.createElement("td", {
    style: {
      textAlign: 'center'
    }
  }, React.createElement("button", {
    onClick: () => handleCopy(row.sellingPrice, row.index),
    style: {
      padding: '0.4rem',
      borderRadius: '0.4rem',
      background: copiedRow === row.index ? '#dcfce7' : '#f1f5f9',
      color: copiedRow === row.index ? '#16a34a' : '#64748b',
      border: 'none',
      cursor: 'pointer'
    }
  }, copiedRow === row.index ? React.createElement(IconCheck, {
    size: 16
  }) : React.createElement(IconCopy, {
    size: 16
  }))))))), React.createElement("button", {
    onClick: () => setShowHighMargin(!showHighMargin),
    style: {
      width: '100%',
      padding: '1rem',
      background: '#f1f5f9',
      color: '#475569',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.1s'
    }
  }, showHighMargin ? React.createElement(IconChevronUp, {
    size: 18
  }) : React.createElement(IconChevronDown, {
    size: 18
  }), " ", showHighMargin ? '고가산 구간 접기' : '51% ~ 100% 구간 펼쳐보기'))))));
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));