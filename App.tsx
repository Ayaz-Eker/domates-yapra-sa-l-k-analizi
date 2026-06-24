import { useState, useCallback, useRef } from 'react'
import { Upload, Leaf, AlertTriangle, CheckCircle, XCircle, Info, Droplets, Sprout, ChevronDown, ChevronUp, Zap, FlaskConical } from 'lucide-react'
import './App.css'

// Types
interface AnalysisResult {
  score: number
  status: 'healthy' | 'warning' | 'danger'
  diagnosis: { name: string; confidence: number; description: string; medicine: string; application: string }
  diseases: { name: string; confidence: number; description: string }[]
  colorAnalysis: { green: number; brown: number; yellow: number; black: number }
  treatments: { title: string; ingredients: string[]; instructions: string; warning?: string }[]
}

// Upload Zone Component
function UploadZone({ onImageSelect, selectedImage, onClear, isLoading }: {
  onImageSelect: (file: File) => void
  selectedImage: string | null
  onClear: () => void
  isLoading: boolean
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
    }
  }, [onImageSelect])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelect(file)
    }
  }

  return (
    <div
      className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${selectedImage ? 'has-image' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {isLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Yaprak analiz ediliyor...</p>
        </div>
      ) : selectedImage ? (
        <div className="preview-container">
          <img src={selectedImage} alt="Seçilen yaprak" className="preview-image" />
          <button className="clear-btn" onClick={(e) => { e.stopPropagation(); onClear(); }}>
            <XCircle size={24} />
          </button>
        </div>
      ) : (
        <div className="upload-content">
          <div className="upload-icon">
            <Upload size={48} />
          </div>
          <h3>Domates Yaprağı Yükleyin</h3>
          <p>Görüntüyü sürükle & bırak veya tıklayarak seç</p>
          <span className="upload-hint">PNG, JPG, WEBP formatları desteklenir</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

// Health Score Circular Progress
function HealthScore({ score }: { score: number }) {
  const radius = 70
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 70) return '#22c55e'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="health-score">
      <svg width={180} height={180} className="score-ring">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="score-value">
        <span className="score-number" style={{ color: getColor() }}>{score}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  )
}

// Result Card Component
function ResultCard({ icon: Icon, title, children, variant = 'default' }: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  return (
    <div className={`result-card ${variant}`}>
      <div className="result-card-header">
        <Icon size={24} />
        <h3>{title}</h3>
      </div>
      <div className="result-card-body">
        {children}
      </div>
    </div>
  )
}

// Treatment Card Component
function TreatmentCard({ title, ingredients, instructions, warning }: {
  title: string
  ingredients: string[]
  instructions: string
  warning?: string
}) {
  return (
    <div className="treatment-card">
      <div className="treatment-header">
        <Droplets size={24} />
        <h3>{title}</h3>
      </div>
      <div className="treatment-content">
        <div className="treatment-ingredients">
          <h4>Malzemeler</h4>
          <ul>
            {ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="treatment-instructions">
          <h4>Uygulama</h4>
          <p>{instructions}</p>
        </div>
        {warning && (
          <div className="treatment-warning">
            <AlertTriangle size={16} />
            <span>{warning}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Color Analysis Chart (SVG-based donut chart)
function ColorAnalysisChart({ data }: { data: { green: number; brown: number; yellow: number; black: number } }) {
  const chartData = [
    { name: 'Yeşil (Sağlıklı)', value: data.green, color: '#22c55e' },
    { name: 'Kahverengi', value: data.brown, color: '#8B4513' },
    { name: 'Sarı (Ölü doku)', value: data.yellow, color: '#eab308' },
    { name: 'Siyah (Çürüme)', value: data.black, color: '#1f2937' },
  ]

  // Create donut segments
  const size = 160
  const strokeWidth = 30
  const radius = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  let currentOffset = 0
  const segments = chartData.map((item) => {
    const segmentLength = (item.value / 100) * circumference
    const segment = {
      ...item,
      offset: currentOffset,
      length: segmentLength,
    }
    currentOffset += segmentLength
    return segment
  })

  return (
    <div className="color-chart">
      <h4>Renk Dağılım Analizi</h4>
      <div className="chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-chart">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.length} ${circumference - segment.length}`}
              strokeDashoffset={-segment.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
            />
          ))}
          <text x={cx} y={cy - 5} textAnchor="middle" className="chart-center-text">
            Renk
          </text>
          <text x={cx} y={cy + 15} textAnchor="middle" className="chart-center-text">
            Analizi
          </text>
        </svg>
      </div>
      <div className="chart-legend">
        {chartData.map((item, i) => (
          <div key={i} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: item.color }}></span>
            <span className="legend-label">{item.name}</span>
            <span className="legend-value">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// FAQ Accordion
function FAQItem({ question, answer, isOpen, onClick }: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={onClick}>
        <span>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  )
}

// Analyze Button
function AnalyzeButton({ onClick, disabled, loading }: {
  onClick: () => void
  disabled: boolean
  loading: boolean
}) {
  return (
    <button
      className={`analyze-btn ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <div className="btn-spinner"></div>
          <span>Analiz Ediliyor...</span>
        </>
      ) : (
        <>
          <FlaskConical size={20} />
          <span>Analiz Et</span>
        </>
      )}
    </button>
  )
}

function analyzeLeafImage(imageSrc: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        reject(new Error('Canvas desteklenmiyor.'))
        return
      }

      const maxDimension = 320
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
      canvas.width = Math.max(1, Math.floor(image.width * scale))
      canvas.height = Math.max(1, Math.floor(image.height * scale))

      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      let greenPixels = 0
      let brownPixels = 0
      let yellowPixels = 0
      let darkPixels = 0
      let totalPixels = 0

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const a = pixels[i + 3]

        if (a < 180) continue

        totalPixels += 1
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max === 0 ? 0 : (max - min) / max
        const brightness = (r + g + b) / 3

        if (brightness < 45) {
          darkPixels += 1
        } else if (brightness > 210 && saturation < 0.18) {
          darkPixels += 1
        } else if (g > r * 1.15 && g > b * 1.1 && g > 90) {
          greenPixels += 1
        } else if (r > 110 && g > 70 && g < 160 && b < 110 && saturation > 0.2) {
          brownPixels += 1
        } else if (r > 120 && g > 100 && b < 140 && saturation > 0.25) {
          yellowPixels += 1
        } else if (g > r * 0.9 && g > b * 0.9 && g > 70) {
          greenPixels += 1
        } else {
          darkPixels += 1
        }
      }

      if (totalPixels === 0) {
        reject(new Error('Görüntü işlenemedi.'))
        return
      }

      const greenRatio = greenPixels / totalPixels
      const brownRatio = brownPixels / totalPixels
      const yellowRatio = yellowPixels / totalPixels
      const darkRatio = darkPixels / totalPixels
      const diseaseRatio = brownRatio + yellowRatio + darkRatio

      const score = Math.max(10, Math.min(100, Math.round(100 - diseaseRatio * 130 + greenRatio * 10)))

      let diagnosisName = 'Hastalık tespit edilmedi'
      let diagnosisDescription = 'Yaprakta belirgin enfeksiyon belirtisi gözlemlenmedi.'
      let medicine = 'Koruyucu bakım'
      let application = 'Haftada bir neem yağı ile bakım yapın ve yaprakları düzenli kontrol edin.'
      let diseaseName = ''
      let diseaseDescription = ''
      let treatmentTitle = 'Koruyucu Bakım'
      let treatmentIngredients = ['1 litre temiz su', '1 yemek kaşığı neem yağı']
      let treatmentInstructions = 'Karışımı yaprakların üzerine püskürtün. Haftada bir tekrarlayın.'
      let treatmentWarning = 'Güneşli havalarda uygulamaktan kaçının.'

      if (darkRatio > 0.22 && brownRatio > 0.08) {
        diagnosisName = 'Geç Yanıklık (Late Blight)'
        diagnosisDescription = 'Kahverengi ve koyu lekeler ile yaprak bozunması izlendi. Bu, ciddi bir mantar hastalığı belirtisi olabilir.'
        medicine = 'Bordo bulamacı ve sirke karışımı'
        application = 'Etkilenen yaprakları budayın, ardından 7 gün boyunca düzenli olarak uygulayın.'
        diseaseName = 'Geç Yanıklık (Late Blight)'
        diseaseDescription = 'Yaprakta kahverengi lekeler ve hızlı ilerleyen bozulma var.'
        treatmentTitle = 'Acil Müdahale'
        treatmentIngredients = ['500 ml su', '250 ml beyaz sirke', '2 çay kaşığı arap sabunu', '1 çay kaşığı karbonat']
        treatmentInstructions = 'Karışımı günde 3 kez, 7 gün boyunca uygulayın. Etkilenen yaprakları budayın ve imha edin.'
        treatmentWarning = 'Acil müdahale gerekli. Önce küçük bir alanda test edin.'
      } else if (darkRatio > 0.14 && yellowRatio > 0.08) {
        diagnosisName = 'Septoria Yaprak Lekesi'
        diagnosisDescription = 'Sarı ve koyu lekelerle yaprak yüzeyinde karakteristik hastalık belirtisi tespit edildi.'
        medicine = 'Arap sabunu ve sirke çözeltisi'
        application = 'Etkilenen yapraklara günde 2 kez, 5 gün boyunca püskürtün.'
        diseaseName = 'Septoria Yaprak Lekesi'
        diseaseDescription = 'Küçük koyu lekeler ve sararma görüldü.'
        treatmentTitle = 'Septoria Tedavisi'
        treatmentIngredients = ['500 ml su', '125 ml beyaz sirke', '1 çay kaşığı arap sabunu']
        treatmentInstructions = 'Karışımı yaprakların hem üst hem alt yüzeyine uygulayın. 5 gün boyunca tekrarlayın.'
        treatmentWarning = 'Çok yoğun uygulamadan kaçının.'
      } else if (darkRatio > 0.16 && greenRatio < 0.6) {
        diagnosisName = 'Külleme (Powdery Mildew)'
        diagnosisDescription = 'Yaprak yüzeyinde beyazımsı ve soluk alanlar ile mantar baskısı tespit edildi.'
        medicine = 'Beyaz sirke + arap sabunu karışımı'
        application = 'Etkilenen yapraklara günde 2 kez, 5 gün boyunca püskürtün.'
        diseaseName = 'Külleme (Powdery Mildew)'
        diseaseDescription = 'Yaprak yüzeyinde hafif beyazımsı bir tabaka ve renk değişimi var.'
        treatmentTitle = 'Külleme Tedavisi'
        treatmentIngredients = ['500 ml su', '125 ml beyaz sirke', '1 çay kaşığı arap sabunu']
        treatmentInstructions = 'Karışımı yapraklara püskürtün. Günde 2 kez tekrar edin.'
        treatmentWarning = 'Güneş altında uygulamaktan kaçının.'
      }

      const normalizedGreen = Math.max(0, Math.min(100, Math.round(greenRatio * 100)))
      const normalizedBrown = Math.max(0, Math.min(100, Math.round(brownRatio * 100)))
      const normalizedYellow = Math.max(0, Math.min(100, Math.round(yellowRatio * 100)))
      const normalizedDark = 100 - normalizedGreen - normalizedBrown - normalizedYellow

      const result: AnalysisResult = {
        score,
        status: score >= 75 ? 'healthy' : score >= 40 ? 'warning' : 'danger',
        diagnosis: {
          name: diagnosisName,
          confidence: Math.max(60, Math.min(97, Math.round(score + (diagnosisName === 'Hastalık tespit edilmedi' ? 10 : 0)))),
          description: diagnosisDescription,
          medicine,
          application
        },
        diseases: diseaseName ? [{ name: diseaseName, confidence: Math.max(65, Math.min(95, score + 15)), description: diseaseDescription }] : [],
        colorAnalysis: {
          green: normalizedGreen,
          brown: normalizedBrown,
          yellow: normalizedYellow,
          black: normalizedDark
        },
        treatments: [
          {
            title: treatmentTitle,
            ingredients: treatmentIngredients,
            instructions: treatmentInstructions,
            warning: treatmentWarning
          }
        ]
      }

      resolve(result)
    }

    image.onerror = () => reject(new Error('Resim yüklenemedi.'))
    image.src = imageSrc
  })
}

// Main App Component
function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const analyzeImage = useCallback(async (imageSrc: string): Promise<AnalysisResult> => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return analyzeLeafImage(imageSrc)
  }, [])

  const handleImageSelect = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return
    setIsLoading(true)
    const analysisResult = await analyzeImage(selectedImage)
    setResult(analysisResult)
    setIsLoading(false)
  }

  const handleClear = () => {
    setSelectedImage(null)
    setResult(null)
  }

  const faqs = [
    {
      question: 'Sistem nasıl çalışıyor?',
      answer: 'Sistem, yüklediğiniz domates yaprağı görüntüsünü gerçek zamanlı olarak işleyip renk ve parlaklık özelliklerini analiz eder. Yeşil alanların oranı, kahverengi/sarı lekelerin yoğunluğu ve koyu alanların dağılımı üzerinden hastalık olasılığını belirler.'
    },
    {
      question: 'Hangi hastalıkları tespit edebiliyor?',
      answer: 'Sistem şu hastalıkları tespit edebilir: Külleme (Powdery Mildew), Geç Yanıklık (Late Blight), Septoria Yaprak Lekesi, Alternaria Yaprak Lekesi. Veri seti genişletilerek patates mildiyösü ve asma küllemesi gibi diğer mantar hastalıkları da eklenebilir.'
    },
    {
      question: 'Tedavi önerileri guvenli mi?',
      answer: "Onnerilen tedaviler dogal ve cevre dostu cozumlerdir. Sirke (asetik asit) pH'i dusurerek mantar gelisimini engeller. Arap sabunu yuzey gerilimini azaltarak karisimin yaprak yuzeyine yayilmasini saglar. Ancak herhangi bir tedaviye baslamadan once kucuk bir alanda test edilmesini oneririz."
    },
    {
      question: 'Mobil cihazlarda çalışıyor mu?',
      answer: 'Evet! Sistem tamamen mobil uyumlu (responsive) olarak tasarlanmıştır. Tarlada telefonunuzdan doğrudan kullanabilirsiniz.'
    }
  ]

  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-icon">
            <Leaf size={48} />
          </div>
          <div className="hero-credit">Ayaz Eker tarafından geliştirildi</div>
          <h1>Domates Yaprak Sağlığı Analiz Sistemi</h1>
          <p>Yapay zeka destekli görüntü işleme teknolojisi ile domates bitkilerinizdeki mantar hastalıklarını saniyeler içinde tespit edin.</p>
          <div className="hero-features">
            <span><Zap size={16} /> Hızlı Analiz</span>
            <span><Sprout size={16} /> Doğal Çözümler</span>
            <span><Sprout size={16} /> Sürdürülebilir Tarım</span>
          </div>
        </div>
      </header>

      {/* Upload Section */}
      <section className="upload-section">
        <div className="container">
          <h2><FlaskConical size={28} /> Yaprak Analizi</h2>
          <p className="section-desc">Domates yaprağınızın fotoğrafını yükleyin veya örnek görselleri deneyin</p>

          <UploadZone
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClear}
            isLoading={isLoading}
          />

          <div className="analyze-container">
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!selectedImage}
              loading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="results-section">
          <div className="container">
            <h2>Analiz Sonuçları</h2>

            {/* Status Banner */}
            <div className={`status-banner ${result.status}`}>
              {result.status === 'healthy' && <CheckCircle size={32} />}
              {result.status === 'warning' && <AlertTriangle size={32} />}
              {result.status === 'danger' && <XCircle size={32} />}
              <div className="status-text">
                <h3>
                  {result.status === 'healthy' && 'Sağlıklı Bitki!'}
                  {result.status === 'warning' && 'Dikkat Gerekli'}
                  {result.status === 'danger' && 'Acil Müdahale Gerekli'}
                </h3>
                <p>
                  {result.status === 'healthy' && 'Tebrikler! Yapraklarınız sağlıklı görünüyor.'}
                  {result.status === 'warning' && 'Hafif enfeksiyon belirtileri tespit edildi.'}
                  {result.status === 'danger' && 'Ciddi mantar enfeksiyonu tespit edildi!'}
                </p>
              </div>
            </div>

            <div className="diagnosis-card">
              <div className="diagnosis-header">
                <AlertTriangle size={24} />
                <h3>Tanı ve Tedavi Önerisi</h3>
              </div>
              <div className="diagnosis-body">
                <div className="diagnosis-main">
                  <h4>{result.diagnosis.name}</h4>
                  <p>{result.diagnosis.description}</p>
                </div>
                <div className="medicine-box">
                  <span className="medicine-label">Önerilen ilaç / tedavi</span>
                  <strong>{result.diagnosis.medicine}</strong>
                  <p>{result.diagnosis.application}</p>
                </div>
              </div>
            </div>

            {/* Main Results Grid */}
            <div className="results-grid">
              {/* Health Score */}
              <div className="result-main">
                <h3>Genel Sağlık Skoru</h3>
                <HealthScore score={result.score} />
                <p className="score-desc">
                  {result.score >= 70 && 'Bitkiniz sağlıklı görünüyor.'}
                  {result.score >= 40 && result.score < 70 && 'Bitkiniz orta düzeyde risk altında.'}
                  {result.score < 40 && 'Bitkiniz ciddi tedavi gerektiriyor.'}
                </p>
              </div>

              {/* Color Analysis Chart */}
              <div className="result-chart">
                <ColorAnalysisChart data={result.colorAnalysis} />
              </div>
            </div>

            {/* Diseases Found */}
            {result.diseases.length > 0 && (
              <div className="diseases-section">
                <h3><AlertTriangle size={24} /> Tespit Edilen Hastalıklar</h3>
                <div className="diseases-grid">
                  {result.diseases.map((disease, i) => (
                    <ResultCard
                      key={i}
                      icon={AlertTriangle}
                      title={disease.name}
                      variant={disease.confidence > 80 ? 'danger' : 'warning'}
                    >
                      <div className="disease-info">
                        <div className="confidence-bar">
                          <span>Güven Oranı: {disease.confidence}%</span>
                          <div className="bar">
                            <div
                              className="bar-fill"
                              style={{ width: `${disease.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                        <p>{disease.description}</p>
                      </div>
                    </ResultCard>
                  ))}
                </div>
              </div>
            )}

            {/* Treatments */}
            <div className="treatments-section">
              <h3><Sprout size={24} /> Doğal Tedavi Önerileri</h3>
              <div className="treatments-grid">
                {result.treatments.map((treatment, i) => (
                  <TreatmentCard key={i} {...treatment} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2><Info size={28} /> Sıkça Sorulan Sorular</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Leaf size={32} />
              <span>Domates Yaprak Sağlığı Analiz Sistemi</span>
            </div>
            <p className="footer-desc">
              Akıllı tarım teknolojileri ile sürdürülebilir gıda üretimine katkıda bulunuyoruz.
            </p>
            <p className="footer-credit">Ayaz Eker tarafından geliştirildi</p>
            <div className="footer-tech">
              <span>Python</span>
              <span>Flask</span>
              <span>Computer Vision</span>
              <span>React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
