import { ChartSpec } from '../components/Chart';

export type Language = 'en' | 'es';

export interface Role {
  id: string;
  labelEn: string;
  labelEs: string;
}

export interface Scenario {
  id: string;
  roleId: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  questionEn: string;
  questionEs: string;
  result: {
    thinkingSignalsEn: string[];
    thinkingSignalsEs: string[];
    insightEn: string;
    insightEs: string;
    evidenceEn: string[];
    evidenceEs: string[];
    sourcesEn: string[];
    sourcesEs: string[];
    chartSpec: ChartSpec;
  };
}

export const ROLES: Role[] = [
  { id: 'sales', labelEn: 'Sales', labelEs: 'Ventas' },
  { id: 'risk', labelEn: 'Risk', labelEs: 'Riesgo' },
  { id: 'operations', labelEn: 'Operations', labelEs: 'Operaciones' },
  { id: 'cx', labelEn: 'Customer Experience', labelEs: 'Experiencia Cliente' },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "sales_closing_opportunities",
    roleId: "sales",
    titleEn: "Closing Opportunities",
    titleEs: "Cierre de oportunidades",
    descEn: "Analyze pipeline data to identify which deals are most likely to close soon.",
    descEs: "Analiza el pipeline para identificar qué oportunidades tienen mayor probabilidad de cierre.",
    questionEn: "Which deals in our current pipeline are most likely to close this month?",
    questionEs: "¿Qué deals del pipeline actual tienen más probabilidad de cerrar este mes?",
    result: {
      thinkingSignalsEn: [
        "Scanning recent pipeline movement…",
        "Comparing win patterns across similar deals…",
        "Weighing engagement and deal momentum…",
        "Prioritizing accounts by close likelihood…"
      ],
      thinkingSignalsEs: [
        "Analizando movimiento reciente del pipeline…",
        "Comparando patrones de cierre en deals similares…",
        "Ponderando engagement y momentum comercial…",
        "Priorizando cuentas por probabilidad de cierre…"
      ],
      insightEn: "Here’s what I’m seeing: accounts contacted in the last 14 days are the most likely to close this month—especially mid-market tech.",
      insightEs: "Esto es lo que veo: las cuentas contactadas en los últimos 14 días son las más probables de cerrar este mes, especialmente mid-market tech.",
      evidenceEn: [
        "Recent engagement correlates with shorter sales cycles",
        "Similar deals historically close within ~30 days",
        "Engagement signals are above segment baseline"
      ],
      evidenceEs: [
        "Engagement reciente correlaciona con ciclos de venta más cortos",
        "Deals similares históricamente cierran en ~30 días",
        "Señales de interacción por encima del baseline del segmento"
      ],
      sourcesEn: ["CRM activity", "Sales pipeline", "Engagement signals"],
      sourcesEs: ["Actividad CRM", "Pipeline de ventas", "Señales de engagement"],
      chartSpec: {
        type: "bar",
        titleEN: "Close probability by opportunity type",
        titleES: "Probabilidad de cierre por tipo de oportunidad",
        unit: "percent",
        series: [
          { labelEN: "Renewal (Q2) - Client X", labelES: "Renovación (Q2) - Cliente X", value: 0.71 },
          { labelEN: "Expansion - Client Y", labelES: "Expansión - Cliente Y", value: 0.58 },
          { labelEN: "New logo - Client Z", labelES: "Nuevo logo - Cliente Z", value: 0.36 }
        ],
        highlightIndex: 0
      }
    }
  },

  {
    id: "sales_deal_slippage_risk",
    roleId: "sales",
    titleEn: "Revenue Forecast Risk",
    titleEs: "Riesgo en el forecast de ingresos",
    descEn: "Assess whether current pipeline momentum is enough to hit the quarterly revenue target.",
    descEs: "Evalúa si el momentum actual del pipeline es suficiente para cumplir el objetivo trimestral de ingresos.",
    questionEn: "Are we currently on track to hit our quarterly revenue target?",
    questionEs: "¿Estamos realmente en camino de cumplir el objetivo de ingresos del trimestre?",
    result: {
      thinkingSignalsEn: [
        "Reviewing weighted pipeline coverage…",
        "Tracking late-stage deal velocity…",
        "Benchmarking forecast pace against prior quarters…",
        "Estimating the gap to target…"
      ],
      thinkingSignalsEs: [
        "Revisando cobertura ponderada del pipeline…",
        "Siguiendo la velocidad de deals en etapa final…",
        "Comparando el ritmo del forecast contra trimestres anteriores…",
        "Estimando la brecha frente al objetivo…"
      ],
      insightEn: "At the current pace, revenue will likely fall short by about 8–10%. Most of the gap comes from three enterprise deals that have stalled in late stage.",
      insightEs: "Al ritmo actual, los ingresos podrían quedar 8–10% por debajo del objetivo. La mayor parte del gap viene de tres deals enterprise que se han estancado en etapa final.",
      evidenceEn: [
        "Late-stage deals show reduced activity over the last 10 days",
        "Similar forecast pacing historically missed quarterly target",
        "Pipeline momentum is below last quarter's closing curve"
      ],
      evidenceEs: [
        "Los deals late-stage muestran menor actividad en los últimos 10 días",
        "Un pacing similar del forecast históricamente falló el target trimestral",
        "El momentum del pipeline está por debajo de la curva de cierre del trimestre anterior"
      ],
      sourcesEn: ["CRM pipeline", "Forecast model", "Activity logs"],
      sourcesEs: ["Pipeline CRM", "Modelo de forecast", "Logs de actividad"],
      chartSpec: {
        type: "line",
        titleEN: "Projected quarterly revenue vs target",
        titleES: "Ingresos proyectados del trimestre vs objetivo",
        unit: "count",
        points: [
          { t: "W1", v: 18 },
          { t: "W2", v: 39 },
          { t: "W3", v: 61 },
          { t: "W4", v: 82 }
        ],
        anomalyThreshold: 100
      }
    }
  },

  {
    id: "sales_next_best_action",
    roleId: "sales",
    titleEn: "Next Best Action",
    titleEs: "Siguiente mejor acción",
    descEn: "Recommend actions that improve the probability of closing key deals.",
    descEs: "Recomienda acciones que aumentan la probabilidad de cierre.",
    questionEn: "What is the next best action our team should take to increase the probability of closing key deals?",
    questionEs: "¿Cuál es la siguiente mejor acción para aumentar la probabilidad de cierre?",
    result: {
      thinkingSignalsEn: [
        "Analyzing deal progression signals…",
        "Comparing tactics from successful closes…",
        "Measuring channel effectiveness…",
        "Selecting the highest-impact next step…"
      ],
      thinkingSignalsEs: [
        "Analizando señales de progresión del deal…",
        "Comparando tácticas de cierres exitosos…",
        "Midiendo efectividad por canal…",
        "Seleccionando la siguiente acción de mayor impacto…"
      ],
      insightEn: "If you want the fastest lift, schedule an executive follow-up. Late-stage deals respond much better than email-only follow-ups.",
      insightEs: "Si buscas el mayor impacto rápido, agenda un seguimiento ejecutivo. En late-stage funciona mucho mejor que solo email.",
      evidenceEn: [
        "Executive engagement accelerates late-stage decisions",
        "Similar accounts responded best to synchronous outreach",
        "Email-only follow-ups correlate with longer stage duration"
      ],
      evidenceEs: [
        "Engagement ejecutivo acelera decisiones late-stage",
        "Cuentas similares responden mejor a contacto sincrónico",
        "Seguimiento solo por email correlaciona con mayor duración de etapa"
      ],
      sourcesEn: ["CRM activity", "Win/loss history", "Channel logs"],
      sourcesEs: ["Actividad CRM", "Historial win/loss", "Logs de canales"],
      chartSpec: {
        type: "bar",
        titleEN: "Expected lift by action (next 14 days)",
        titleES: "Impacto esperado por acción (próximos 14 días)",
        unit: "percent",
        series: [
          { labelEN: "Exec follow-up + agenda", labelES: "Seguimiento ejecutivo + agenda", value: 0.24 },
          { labelEN: "ROI one-pager to champion", labelES: "One-pager ROI al champion", value: 0.13 },
          { labelEN: "Security / compliance call", labelES: "Llamada seguridad / compliance", value: 0.09 }
        ],
        highlightIndex: 0
      }
    }
  },

  {
    id: "risk_suspicious_transactions",
    roleId: "risk",
    titleEn: "Fraud Pattern Escalation",
    titleEs: "Escalación de patrón de fraude",
    descEn: "Detect coordinated fraud behavior emerging across multiple accounts and signals.",
    descEs: "Detecta comportamiento coordinado de fraude emergiendo en múltiples cuentas y señales.",
    questionEn: "Are we seeing an emerging fraud pattern we should escalate immediately?",
    questionEs: "¿Estamos viendo un patrón emergente de fraude que debamos escalar de inmediato?",
    result: {
      thinkingSignalsEn: [
        "Scanning cross-account activity clusters…",
        "Comparing device fingerprints and location overlap…",
        "Reviewing velocity and behavior anomalies…",
        "Scoring escalation likelihood…"
      ],
      thinkingSignalsEs: [
        "Revisando clusters de actividad entre cuentas…",
        "Comparando fingerprints de dispositivo y overlap de ubicación…",
        "Analizando anomalías de velocidad y comportamiento…",
        "Calculando probabilidad de escalación…"
      ],
      insightEn: "A coordinated pattern is emerging across multiple accounts using the same device fingerprint and location cluster.",
      insightEs: "Está emergiendo un patrón coordinado en varias cuentas usando el mismo fingerprint de dispositivo y cluster de ubicación.",
      evidenceEn: [
        "Shared device fingerprint appears across multiple flagged accounts",
        "Location overlap exceeds normal customer behavior",
        "Similar signal combinations were seen in previous fraud incidents"
      ],
      evidenceEs: [
        "El mismo fingerprint de dispositivo aparece en múltiples cuentas marcadas",
        "El overlap de ubicación excede el comportamiento normal del cliente",
        "La misma combinación de señales se vio en incidentes previos de fraude"
      ],
      sourcesEn: ["Fraud monitoring", "Device graph", "Location intelligence"],
      sourcesEs: ["Monitoreo de fraude", "Grafo de dispositivos", "Inteligencia de ubicación"],
      chartSpec: {
        type: "radar",
        titleEN: "Escalation profile by fraud signal",
        titleES: "Perfil de escalación por señal de fraude",
        unit: "percent",
        metrics: [
          { subjectEN: "Device overlap", subjectES: "Overlap dispositivo", value: 0.82 },
          { subjectEN: "Location cluster", subjectES: "Cluster ubicación", value: 0.74 },
          { subjectEN: "Velocity anomaly", subjectES: "Anomalía velocidad", value: 0.68 },
          { subjectEN: "Behavior shift", subjectES: "Cambio conductual", value: 0.63 },
          { subjectEN: "Escalation confidence", subjectES: "Confianza escalación", value: 0.79 }
        ],
        highlightIndex: 4
      }
    }
  },

  {
    id: "risk_fraud_alert_prioritization",
    roleId: "risk",
    titleEn: "Fraud Alert Prioritization",
    titleEs: "Priorizar alertas de fraude",
    descEn: "Analyze fraud alerts and identify the highest-risk cases.",
    descEs: "Analiza alertas de fraude y prioriza los casos más críticos.",
    questionEn: "Which fraud alerts should our team prioritize right now?",
    questionEs: "¿Qué alertas de fraude debemos priorizar ahora?",
    result: {
      thinkingSignalsEn: [
        "Aggregating fraud signals…",
        "Checking severity and confidence…",
        "Looking for multi-signal matches…",
        "Sorting alerts by urgency…"
      ],
      thinkingSignalsEs: [
        "Agrupando señales de fraude…",
        "Revisando severidad y confianza…",
        "Buscando coincidencia de múltiples señales…",
        "Ordenando alertas por urgencia…"
      ],
      insightEn: "Focus on the high-severity alerts where multiple signals match—device, location, and velocity. Those are the strongest fraud indicators.",
      insightEs: "Enfócate en las alertas de alta severidad donde coinciden varias señales: dispositivo, ubicación y velocidad.",
      evidenceEn: [
        "Risk score exceeds historical threshold",
        "Velocity anomalies across multiple transactions",
        "Multiple signals occur simultaneously"
      ],
      evidenceEs: [
        "Score de riesgo supera umbral histórico",
        "Anomalías de velocidad en múltiples transacciones",
        "Ocurren múltiples señales al mismo tiempo"
      ],
      sourcesEn: ["Fraud monitoring", "Transaction logs", "Behavior signals"],
      sourcesEs: ["Monitoreo de fraude", "Logs de transacciones", "Señales de comportamiento"],
      chartSpec: {
        type: "radar",
        titleEN: "Fraud risk profile by signal cluster",
        titleES: "Perfil de riesgo de fraude por cluster de señales",
        unit: "percent",
        metrics: [
          { subjectEN: "Device mismatch", subjectES: "Dispositivo", value: 0.79 },
          { subjectEN: "Location anomaly", subjectES: "Ubicación", value: 0.71 },
          { subjectEN: "Velocity spike", subjectES: "Velocidad", value: 0.84 },
          { subjectEN: "Behavior shift", subjectES: "Comportamiento", value: 0.63 },
          { subjectEN: "Confidence score", subjectES: "Confianza", value: 0.76 }
        ],
        highlightIndex: 2
      }
    }
  },

  {
    id: "risk_exposure_concentration",
    roleId: "risk",
    titleEn: "Exposure Concentration",
    titleEs: "Concentración de exposición",
    descEn: "Detect risk concentration across accounts or segments.",
    descEs: "Detecta riesgos de concentración en el portafolio.",
    questionEn: "Are there concentration risks in our portfolio that we should address?",
    questionEs: "¿Existen riesgos de concentración en nuestro portafolio?",
    result: {
      thinkingSignalsEn: [
        "Calculating exposure by segment…",
        "Comparing against internal limits…",
        "Checking week-over-week changes…",
        "Flagging concentration hotspots…"
      ],
      thinkingSignalsEs: [
        "Calculando exposición por segmento…",
        "Comparando contra límites internos…",
        "Revisando cambios semana contra semana…",
        "Detectando puntos de concentración…"
      ],
      insightEn: "One segment is taking a larger share than expected—and it’s trending upward this week. That’s a concentration risk worth addressing.",
      insightEs: "Un segmento está tomando más participación de la esperada y además va subiendo esta semana.",
      evidenceEn: [
        "Segment allocation exceeds internal benchmark",
        "Week-over-week exposure increased",
        "Concentration driven by a small set of accounts"
      ],
      evidenceEs: [
        "Asignación por segmento excede benchmark interno",
        "La exposición subió vs la semana pasada",
        "Concentración impulsada por pocas cuentas"
      ],
      sourcesEn: ["Portfolio analytics", "Risk reports", "Exposure dashboards"],
      sourcesEs: ["Analítica de portafolio", "Reportes de riesgo", "Dashboards de exposición"],
      chartSpec: {
        type: "pie",
        titleEN: "Exposure by segment (synthetic demo)",
        titleES: "Exposición por segmento (demo sintético)",
        slices: [
          { labelEN: "SME lending", labelES: "Crédito PyME", value: 0.32 },
          { labelEN: "Retail credit cards", labelES: "Tarjetas retail", value: 0.26 },
          { labelEN: "Cross-border", labelES: "Transfronterizo", value: 0.22 },
          { labelEN: "Other", labelES: "Otros", value: 0.2 }
        ],
        highlightIndex: 0
      }
    }
  },

  {
    id: "ops_operational_bottlenecks",
    roleId: "operations",
    titleEn: "Process Automation Opportunity",
    titleEs: "Oportunidad de automatización del proceso",
    descEn: "Identify which operational steps could be automated to reduce backlog and manual workload fastest.",
    descEs: "Identifica qué pasos operativos podrían automatizarse para reducir más rápido el backlog y la carga manual.",
    questionEn: "Which operational steps could be automated to reduce backlog fastest?",
    questionEs: "¿Qué pasos del proceso podríamos automatizar para reducir el backlog más rápido?",
    result: {
      thinkingSignalsEn: [
        "Mapping manual workload by process step…",
        "Measuring queue impact across stages…",
        "Estimating automation fit by task type…",
        "Ranking highest-impact automation candidates…"
      ],
      thinkingSignalsEs: [
        "Mapeando carga manual por etapa del proceso…",
        "Midiendo impacto en colas a través de las etapas…",
        "Estimando fit de automatización por tipo de tarea…",
        "Priorizando oportunidades de automatización de mayor impacto…"
      ],
      insightEn: "Automating document validation would remove nearly 40% of manual workload and significantly reduce the approval queue.",
      insightEs: "Automatizar la validación documental eliminaría casi 40% del trabajo manual y reduciría significativamente la cola de aprobación.",
      evidenceEn: [
        "Document validation has the highest repeat volume",
        "Approval queue depends heavily on validation throughput",
        "Similar automation reduced backlog in comparable workflows"
      ],
      evidenceEs: [
        "La validación documental tiene el mayor volumen repetitivo",
        "La cola de aprobación depende fuertemente del throughput de validación",
        "Automatizaciones similares redujeron backlog en workflows comparables"
      ],
      sourcesEn: ["Workflow logs", "Task analytics", "Queue metrics"],
      sourcesEs: ["Logs de workflow", "Analítica de tareas", "Métricas de colas"],
      chartSpec: {
        type: "bar",
        titleEN: "Automation impact by process step",
        titleES: "Impacto de automatización por etapa del proceso",
        unit: "percent",
        series: [
          { labelEN: "Document validation", labelES: "Validación documental", value: 0.39 },
          { labelEN: "Manual approval routing", labelES: "Ruteo aprobación manual", value: 0.24 },
          { labelEN: "Reconciliation checks", labelES: "Revisiones conciliación", value: 0.16 }
        ],
        highlightIndex: 0
      }
    }
  },

  {
    id: "ops_sla_risk_detection",
    roleId: "operations",
    titleEn: "SLA Risk Detection",
    titleEs: "Riesgo de SLA",
    descEn: "Predict which services are at risk of breaching SLAs.",
    descEs: "Predice qué servicios están en riesgo de incumplir SLA.",
    questionEn: "Which services are at risk of breaching SLA commitments?",
    questionEs: "¿Qué servicios están en riesgo de incumplir SLA?",
    result: {
      thinkingSignalsEn: [
        "Reviewing SLA timers…",
        "Checking backlog trend…",
        "Estimating breach probability…",
        "Flagging the riskiest queue…"
      ],
      thinkingSignalsEs: [
        "Revisando timers de SLA…",
        "Analizando tendencia del backlog…",
        "Estimando probabilidad de incumplimiento…",
        "Marcando la cola con mayor riesgo…"
      ],
      insightEn: "The highest SLA risk is currently in reconciliation. Cases are stacking up and a breach is likely within the next 24 hours unless work is redistributed.",
      insightEs: "El mayor riesgo de SLA está en conciliación. Los casos se están acumulando y podría haber incumplimiento en 24 horas.",
      evidenceEn: [
        "Backlog increased compared to yesterday",
        "Most delayed cases share the same queue",
        "Current load matches historical breach conditions"
      ],
      evidenceEs: [
        "Backlog aumentó vs ayer",
        "Los casos más retrasados comparten la misma cola",
        "La carga coincide con condiciones históricas de incumplimiento"
      ],
      sourcesEn: ["Service monitoring", "Operational logs", "SLA timers"],
      sourcesEs: ["Monitoreo de servicios", "Logs operativos", "Timers SLA"],
      chartSpec: {
        type: "line",
        titleEN: "Backlog trend (cases) vs SLA risk",
        titleES: "Tendencia de backlog (casos) vs riesgo SLA",
        unit: "count",
        points: [
          { t: "09:00", v: 42 },
          { t: "11:00", v: 55 },
          { t: "13:00", v: 64 },
          { t: "15:00", v: 73 },
          { t: "17:00", v: 81 }
        ],
        anomalyThreshold: 70
      }
    }
  },

  {
    id: "ops_capacity_optimization",
    roleId: "operations",
    titleEn: "Capacity Optimization",
    titleEs: "Optimización de capacidad",
    descEn: "Suggest better allocation of operational resources.",
    descEs: "Sugiere mejor asignación de recursos operativos.",
    questionEn: "How should we rebalance resources to handle current demand?",
    questionEs: "¿Cómo deberíamos redistribuir recursos para manejar la demanda?",
    result: {
      thinkingSignalsEn: [
        "Measuring demand peaks…",
        "Simulating workload shifts…",
        "Estimating impact on backlog…",
        "Selecting the best rebalancing option…"
      ],
      thinkingSignalsEs: [
        "Midiendo picos de demanda…",
        "Simulando redistribución de carga…",
        "Estimando impacto en backlog…",
        "Seleccionando la mejor opción…"
      ],
      insightEn: "A small shift goes a long way: moving about 12% of capacity to the peak queue could reduce backlog by roughly one-third.",
      insightEs: "Un pequeño ajuste puede tener gran impacto: mover alrededor de 12% de capacidad a la cola pico podría reducir el backlog aproximadamente en un tercio.",
      evidenceEn: [
        "Demand peaks repeat in consistent windows",
        "Coverage dips below target during peak hours",
        "Small shifts historically improved throughput"
      ],
      evidenceEs: [
        "Picos de demanda se repiten en ventanas consistentes",
        "Cobertura cae bajo el objetivo en horas pico",
        "Pequeños cambios mejoraron throughput históricamente"
      ],
      sourcesEn: ["Workload queues", "Staff scheduling", "Throughput metrics"],
      sourcesEs: ["Colas de trabajo", "Scheduling", "Métricas de throughput"],
      chartSpec: {
        type: "area",
        titleEN: "Workload volume vs capacity coverage",
        titleES: "Volumen de carga vs cobertura de capacidad",
        unit: "count",
        points: [
          { t: "09:00", v: 38 },
          { t: "11:00", v: 52 },
          { t: "13:00", v: 67 },
          { t: "15:00", v: 61 },
          { t: "17:00", v: 44 }
        ],
        anomalyThreshold: 60
      }
    }
  },

  {
    id: "cx_churn_risk_analysis",
    roleId: "cx",
    titleEn: "Customer Expansion Opportunity",
    titleEs: "Oportunidad de expansión de clientes",
    descEn: "Identify customers showing strong signals for upsell or expansion based on product and service behavior.",
    descEs: "Identifica clientes que muestran señales sólidas de upsell o expansión según su comportamiento de producto y servicio.",
    questionEn: "Which customers show signals that they are ready for expansion?",
    questionEs: "¿Qué clientes muestran señales de estar listos para expansión?",
    result: {
      thinkingSignalsEn: [
        "Reviewing product usage growth…",
        "Checking support friction and account health…",
        "Comparing engagement vs successful expansion cohorts…",
        "Ranking accounts by expansion readiness…"
      ],
      thinkingSignalsEs: [
        "Revisando crecimiento en uso de producto…",
        "Analizando fricción de soporte y salud de cuenta…",
        "Comparando engagement vs cohorts con expansión exitosa…",
        "Priorizando cuentas por readiness de expansión…"
      ],
      insightEn: "Several mid-market accounts show rising usage, high engagement, and low support friction — a strong expansion signal.",
      insightEs: "Varias cuentas mid-market muestran crecimiento de uso, alto engagement y baja fricción de soporte — una señal fuerte de expansión.",
      evidenceEn: [
        "Usage growth exceeds expansion cohort baseline",
        "Support friction remains low despite increased activity",
        "Engagement with high-value features has increased significantly"
      ],
      evidenceEs: [
        "El crecimiento de uso supera el baseline de cohorts con expansión",
        "La fricción de soporte se mantiene baja pese al aumento de actividad",
        "El engagement con features de alto valor ha crecido significativamente"
      ],
      sourcesEn: ["Product analytics", "Support health", "Account activity"],
      sourcesEs: ["Analítica de producto", "Salud de soporte", "Actividad de cuenta"],
      chartSpec: {
        type: "bar",
        titleEN: "Expansion readiness drivers",
        titleES: "Drivers de readiness para expansión",
        unit: "percent",
        series: [
          { labelEN: "Usage growth", labelES: "Crecimiento de uso", value: 0.48 },
          { labelEN: "Feature adoption", labelES: "Adopción de features", value: 0.33 },
          { labelEN: "Low support friction", labelES: "Baja fricción de soporte", value: 0.19 }
        ],
        highlightIndex: 0
      }
    }
  },

  {
    id: "cx_nps_drivers",
    roleId: "cx",
    titleEn: "NPS Drivers",
    titleEs: "Drivers de NPS",
    descEn: "Analyze feedback data to understand satisfaction drivers.",
    descEs: "Analiza feedback para entender qué impulsa la satisfacción.",
    questionEn: "What factors are driving changes in our NPS score?",
    questionEs: "¿Qué factores están impulsando cambios en NPS?",
    result: {
      thinkingSignalsEn: [
        "Scanning survey themes…",
        "Grouping comments by topic…",
        "Cross-checking service metrics…",
        "Identifying the strongest drivers…"
      ],
      thinkingSignalsEs: [
        "Revisando temas en encuestas…",
        "Agrupando comentarios por tópico…",
        "Contrastando con métricas de servicio…",
        "Identificando los drivers principales…"
      ],
      insightEn: "Two factors are driving most of the NPS movement right now: response time and onboarding quality. Improving those will deliver the fastest gains.",
      insightEs: "Dos factores están impulsando la mayor parte del movimiento de NPS: tiempo de respuesta y calidad de onboarding.",
      evidenceEn: [
        "Detractors frequently mention response time",
        "Promoters highlight onboarding clarity",
        "Theme frequency aligns with service metrics"
      ],
      evidenceEs: [
        "Detractores mencionan tiempo de respuesta con frecuencia",
        "Promotores destacan claridad en onboarding",
        "Frecuencia de temas coincide con métricas de servicio"
      ],
      sourcesEn: ["NPS surveys", "Feedback analysis", "Service metrics"],
      sourcesEs: ["Encuestas NPS", "Análisis de feedback", "Métricas de servicio"],
      chartSpec: {
        type: "pie",
        titleEN: "Comment themes impacting NPS (demo)",
        titleES: "Temas en comentarios que impactan NPS (demo)",
        slices: [
          { labelEN: "Response time", labelES: "Tiempo de respuesta", value: 0.35 },
          { labelEN: "Onboarding clarity", labelES: "Claridad onboarding", value: 0.29 },
          { labelEN: "App reliability", labelES: "Confiabilidad del app", value: 0.21 },
          { labelEN: "Feature gaps", labelES: "Faltantes de features", value: 0.15 }
        ],
        highlightIndex: 0
      }
    }
  },

  {
    id: "cx_support_deflection",
    roleId: "cx",
    titleEn: "Support Deflection",
    titleEs: "Deflexión de soporte",
    descEn: "Identify opportunities to resolve issues automatically.",
    descEs: "Identifica oportunidades para resolver tickets automáticamente.",
    questionEn: "Which support requests could be resolved automatically before reaching our team?",
    questionEs: "¿Qué solicitudes podrían resolverse automáticamente?",
    result: {
      thinkingSignalsEn: [
        "Clustering tickets by topic…",
        "Measuring volume and complexity…",
        "Checking repeat patterns…",
        "Estimating deflection potential…"
      ],
      thinkingSignalsEs: [
        "Agrupando tickets por tema…",
        "Midiendo volumen y complejidad…",
        "Detectando patrones repetidos…",
        "Estimando potencial de autoservicio…"
      ],
      insightEn: "A small number of repeated topics generate most support tickets. Improving self-service for the top issue alone could reduce ticket volume by around 16%.",
      insightEs: "Un pequeño grupo de temas repetidos genera la mayoría de tickets. Mejorar autoservicio para el principal podría reducir el volumen cerca de 16%.",
      evidenceEn: [
        "Top topic repeats consistently week over week",
        "High volume + low complexity indicates automation fit",
        "Similar improvements reduced tickets historically"
      ],
      evidenceEs: [
        "Tema principal se repite consistentemente semana a semana",
        "Alto volumen + baja complejidad sugiere automatización",
        "Mejoras similares redujeron tickets históricamente"
      ],
      sourcesEn: ["Support tickets", "Knowledge base usage", "Resolution tags"],
      sourcesEs: ["Tickets de soporte", "Uso de base de conocimiento", "Tags de resolución"],
      chartSpec: {
        type: "bar",
        titleEN: "Top ticket topics (weekly volume)",
        titleES: "Principales temas de tickets (volumen semanal)",
        unit: "count",
        series: [
          { labelEN: "Password reset / access", labelES: "Reset contraseña / acceso", value: 310 },
          { labelEN: "Failed transfer status", labelES: "Estado de transferencia fallida", value: 190 },
          { labelEN: "Account onboarding steps", labelES: "Pasos de onboarding", value: 150 }
        ],
        highlightIndex: 0
      }
    }
  }
];

export const UI_STRINGS = {
  en: {
    tapToStart: 'Touch to Start',
    hookTitle: 'From data to decisions in one question',
    hookSubtitle: 'See how Vitti Sense helps leaders turn complex information into clear decisions.',
    startDemo: 'Explore',
    whatIsTitle: 'What is Vitti Sense?',
    whatIsBullets: [
      'Understands natural language questions',
      'Analyzes connected systems and data',
      'Returns clear, explainable answers'
    ],
    selectRole: 'Choose your role',
    selectScenario: 'Select a Scenario',
    typing: 'Vitti Sense analyzing…',
    send: 'Send',
    thinking: 'Vitti Sense analyzing…',
    results: 'Result',
    exploreAnother: 'Try another scenario',
    scanToTake: 'Take this insight with you',
    scanButton: 'I scanned it / Continue',
    backToResults: 'Back to results',
    thankYou: 'You\'re all set ✅',
    resetting: 'Check your phone to continue',
    exit: 'Exit',
    back: 'Back',
    sourcesTitle: 'Sources',
    demoDataDisclaimer: 'Demo data - Simulated insights'
  },
  es: {
    tapToStart: 'Toca para comenzar',
    hookTitle: 'De los datos a la decisión en una sola pregunta',
    hookSubtitle: 'Descubre cómo Vitti Sense ayuda a convertir información compleja en decisiones claras.',
    startDemo: 'Explorar',
    whatIsTitle: '¿Qué es Vitti Sense?',
    whatIsBullets: [
      'Interpreta preguntas en lenguaje natural',
      'Analiza datos y sistemas conectados',
      'Devuelve respuestas claras y explicables'
    ],
    selectRole: 'Elige tu rol',
    selectScenario: 'Selecciona un escenario',
    typing: 'Vitti Sense analizando…',
    send: 'Enviar',
    thinking: 'Vitti Sense analizando…',
    results: 'Resultado',
    exploreAnother: 'Explorar otro escenario',
    scanToTake: 'Llévate este insight',
    scanButton: 'Ya escaneé / Continuar',
    backToResults: 'Volver al resultado',
    thankYou: 'Listo ✅',
    resetting: 'Revisa tu teléfono para continuar',
    exit: 'Salir',
    back: 'Atrás',
    sourcesTitle: 'Fuentes',
    demoDataDisclaimer: 'Datos demo - Insights simulados'
  }
};

export const QR_URL = 'https://example.com/neuralbot';
