/**
 * North — the 12-week hire sprint for Jai.
 *
 * Atlas is the multi-year arc. North is the 90-day shipping plan that sits on
 * top of it and answers one question:
 *
 *   "What do I build, read, ship, and apply this week so that by W12 I am
 *    a credible candidate for an LLM Infrastructure / Inference Engineer role?"
 *
 * Mission:
 *   Senior SWE  →  LLM Inference / AI Systems Engineer in ~12 weeks.
 *
 * Strategy:
 *   1. Ship four flagship portfolio projects, each with measured numbers.
 *      P1: mini-vLLM         — paged KV cache, continuous batching, OpenAI API
 *      P2: ai-gateway        — model router, cost/latency-aware, OTel, cache
 *      P3: rag-prod          — hybrid retrieval, reranker, eval harness, cites
 *      P4: dist-inference    — TP or multi-worker replica serving, scaling bench
 *   2. Land ≥1 merged OSS PR in a real serving project (vLLM / SGLang / TGI / llama.cpp).
 *   3. Build a system-design library of 5 one-pagers for interviews.
 *   4. Open 25+ targeted outreach threads. Convert.
 *
 * Tracks (mirror Atlas):
 *   read   — papers, blogs, docs that earn the right to build
 *   build  — code that runs and produces a number on a benchmark
 *   apply  — visible artifact: PR, README, demo, application, DM
 *   prep   — interview prep, system-design study, mock loops, OSS scouting
 *
 * Half-lives:
 *   durable — attention primitive, KV cache, autoregressive mechanics, roofline
 *             intuition, distributed primitives. ~10y stable.
 *   medium  — vLLM scheduler patterns, paged-attention block layout, current
 *             quant recipes, FA versions. ~3-5y.
 *   fast    — specific SOTA papers (Medusa, EAGLE), exact framework APIs,
 *             current company hiring guides. ~1y. VERIFY before action.
 *
 * Brutal-honesty notes (from research + Atlas's own posture):
 *   - Mini-vLLM is the single highest-ROI portfolio artifact for this lane.
 *     A landed merge PR in vLLM/SGLang beats a half-built clone.
 *   - "OpenAI-compatible API" is table stakes. Without it, no recruiter cares.
 *   - Every project must have a BENCHMARKS.md with hardware, batch, dtype,
 *     and three numbers: TTFT, ITL/throughput, memory. No numbers = no project.
 *   - Cold applications without referrals fail. Outreach starts W6, not W11.
 *   - North is not Atlas-lite. Atlas covers bedrock (math, OS, arch, compilers).
 *     North trusts that and runs flat-out on infra/serving for 12 weeks.
 */

// Reuse all the Atlas types and metadata so North inherits the same shape
// (and so a single set of CSS rules / progress patterns / disclosures cover both).
export type {
  Track,
  Stream,
  Cadence,
  HalfLife,
  ResourceKind,
  Resource,
  Task,
  Week,
  Phase,
} from './atlas-plan'
export {
  HALFLIFE_LABEL,
  RESOURCE_KIND_LABEL,
  STREAM_LABELS,
  TRACK_LABELS,
  BEDROCK_DOMAINS,
  LIVING_LAYER,
  periodWeeks,
} from './atlas-plan'

import type { Cadence, Phase, Resource, Task, Week } from './atlas-plan'

// ────────────────────────────────────────────────────────────────────────
// Resource library — curated, lean. Inlined here so North is standalone.
// ────────────────────────────────────────────────────────────────────────

const R = {
  // ── Inference fundamentals ────────────────────────────────────────────
  weng_inference: {
    kind: 'blog',
    title: 'Lilian Weng — Large Transformer Model Inference Optimization',
    url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/',
    hours: '1.5h',
    why: 'The single best mental-model overview of inference optimization. Read first.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  kipperly_speed: {
    kind: 'blog',
    title: 'Horace He — Making Deep Learning Go Brrr From First Principles',
    url: 'https://horace.io/brrr_intro.html',
    hours: '1h',
    why: 'Compute vs memory vs overhead. The lens for every inference decision.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  pagedattention: {
    kind: 'paper',
    title: 'Kwon et al — Efficient Memory Management for LLM Serving with PagedAttention',
    url: 'https://arxiv.org/abs/2309.06180',
    hours: '2h',
    why: 'The paper that defined modern LLM serving. KV cache as paged memory.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  orca: {
    kind: 'paper',
    title: 'Orca — A Distributed Serving System for Transformer-Based Generative Models',
    url: 'https://www.usenix.org/conference/osdi22/presentation/yu',
    hours: '1.5h',
    why: 'Iteration-level scheduling — the trick continuous batching is built on.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  anyscale_batching: {
    kind: 'blog',
    title: 'Anyscale — How Continuous Batching Enables 23x Throughput',
    url: 'https://www.anyscale.com/blog/continuous-batching-llm-inference',
    hours: '45m',
    why: 'Best practical writeup of continuous batching. Pictures + numbers.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  sarathi_serve: {
    kind: 'paper',
    title: 'Sarathi-Serve — Chunked Prefill for High-Throughput Serving',
    url: 'https://arxiv.org/abs/2403.02310',
    hours: '1.5h',
    why: 'Why mixing prefill + decode in one batch beats separating them.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  pope_efficient: {
    kind: 'paper',
    title: 'Pope et al — Efficiently Scaling Transformer Inference',
    url: 'https://arxiv.org/abs/2211.05102',
    hours: '2h',
    why: 'Google\'s analytical framework for serving cost at scale. TP/PP tradeoffs.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // ── Quantization + speculative decoding ───────────────────────────────
  awq: {
    kind: 'paper',
    title: 'AWQ — Activation-aware Weight Quantization',
    url: 'https://arxiv.org/abs/2306.00978',
    hours: '1h',
    why: 'Best weight-only PTQ recipe; ubiquitous in serving stacks.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  gptq: {
    kind: 'paper',
    title: 'GPTQ — Accurate Post-Training Quantization',
    url: 'https://arxiv.org/abs/2210.17323',
    hours: '1h',
    why: 'The other dominant PTQ recipe. Pair with AWQ.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  leviathan_spec: {
    kind: 'paper',
    title: 'Leviathan et al — Fast Inference from Transformers via Speculative Decoding',
    url: 'https://arxiv.org/abs/2211.17192',
    hours: '1h',
    why: 'The original speculative decoding paper. Foundational.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  medusa: {
    kind: 'paper',
    title: 'Medusa — Simple LLM Inference Acceleration with Multiple Decoding Heads',
    url: 'https://arxiv.org/abs/2401.10774',
    hours: '1h',
    why: 'Practical self-speculation without a separate draft model.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  eagle: {
    kind: 'paper',
    title: 'EAGLE — Speculative Sampling Requires Rethinking Feature Uncertainty',
    url: 'https://arxiv.org/abs/2401.15077',
    hours: '1h',
    why: 'Current SOTA spec-decoding in many open stacks. Verify version.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // ── GPU + Triton ──────────────────────────────────────────────────────
  flashattention2: {
    kind: 'paper',
    title: 'FlashAttention-2 — Faster Attention with Better Parallelism',
    url: 'https://arxiv.org/abs/2307.08691',
    hours: '2h',
    why: 'The IO-aware attention algorithm. §3 is required reading for any kernel author.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  flashattention3: {
    kind: 'paper',
    title: 'FlashAttention-3 — Fast and Accurate Attention on Hopper',
    url: 'https://arxiv.org/abs/2407.08608',
    hours: '1.5h',
    why: 'Hopper-specific: warp-specialization + WGMMA + FP8. Verify before reproducing.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,
  triton_docs: {
    kind: 'docs',
    title: 'OpenAI Triton — official tutorials',
    url: 'https://triton-lang.org/main/getting-started/tutorials/index.html',
    hours: '3h',
    why: 'Vector add → fused softmax → matmul. Three tutorials, one weekend.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  gpu_mode: {
    kind: 'video',
    title: 'GPU MODE — community lectures',
    url: 'https://www.youtube.com/@GPUMODE',
    hours: 'ongoing',
    why: 'The center of gravity for practical GPU programming. Lectures 1-2 first.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  nsight_compute: {
    kind: 'docs',
    title: 'NVIDIA Nsight Compute — getting started',
    url: 'https://docs.nvidia.com/nsight-compute/NsightComputeCli/index.html',
    hours: '2h',
    why: 'The profiler. Without NCU, you cannot verify TC utilization or roofline gap.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // ── Serving stacks (OSS) ──────────────────────────────────────────────
  vllm_repo: {
    kind: 'repo',
    title: 'vLLM',
    url: 'https://github.com/vllm-project/vllm',
    why: 'Reference open-source LLM serving engine. Read engine/, attention/, scheduler.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  sglang_repo: {
    kind: 'repo',
    title: 'SGLang',
    url: 'https://github.com/sgl-project/sglang',
    why: 'RadixAttention prefix cache + structured-output kernels; fast-moving stack.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  tgi_repo: {
    kind: 'repo',
    title: 'HuggingFace Text Generation Inference (TGI)',
    url: 'https://github.com/huggingface/text-generation-inference',
    why: 'Rust router + Python shards; another canonical serving architecture.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  llamacpp_repo: {
    kind: 'repo',
    title: 'llama.cpp',
    url: 'https://github.com/ggerganov/llama.cpp',
    why: 'CPU/Metal/CUDA inference in C++. GGUF format + quant kernels.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  tensorrt_llm: {
    kind: 'repo',
    title: 'TensorRT-LLM',
    url: 'https://github.com/NVIDIA/TensorRT-LLM',
    why: 'NVIDIA\'s production inference compiler. Worth reading for plugin/op patterns.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  litellm_repo: {
    kind: 'repo',
    title: 'LiteLLM (router source)',
    url: 'https://github.com/BerriAI/litellm',
    why: 'Read the Router class — fallback, retry, cost tracking patterns.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  hf_generate: {
    kind: 'repo',
    title: 'transformers — modeling_llama.py + generation_utils',
    url: 'https://github.com/huggingface/transformers/blob/main/src/transformers/models/llama/modeling_llama.py',
    why: 'Reference autoregressive loop. Skim before writing your own.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,

  // ── Serving infra patterns ────────────────────────────────────────────
  fastapi_docs: {
    kind: 'docs',
    title: 'FastAPI — official docs',
    url: 'https://fastapi.tiangolo.com/',
    why: 'Async Python HTTP. The default for OpenAI-compatible inference servers.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  openai_api_ref: {
    kind: 'docs',
    title: 'OpenAI API reference — chat completions + streaming',
    url: 'https://platform.openai.com/docs/api-reference/chat',
    why: 'The interface every serving stack mimics. SSE event shape, tool calls, etc.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  otel_docs: {
    kind: 'docs',
    title: 'OpenTelemetry — Python instrumentation',
    url: 'https://opentelemetry.io/docs/languages/python/',
    why: 'Traces + metrics. Required for any "production-grade" infra claim.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  portkey_gateway: {
    kind: 'docs',
    title: 'Portkey — AI Gateway docs',
    url: 'https://portkey.ai/docs',
    why: 'Reference architecture for a real AI gateway: routing, cache, guardrails.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,
  cf_ai_gateway: {
    kind: 'blog',
    title: 'Cloudflare AI Gateway — what & why',
    url: 'https://blog.cloudflare.com/ai-gateway/',
    hours: '30m',
    why: 'Edge AI gateway pattern. Cache, fallback, observability at scale.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // ── RAG ───────────────────────────────────────────────────────────────
  anthropic_contextual: {
    kind: 'blog',
    title: 'Anthropic — Introducing Contextual Retrieval',
    url: 'https://www.anthropic.com/news/contextual-retrieval',
    hours: '45m',
    why: 'Current SOTA prompt-based chunk enrichment. Pair with hybrid retrieval.',
    tier: 1,
    halfLife: 'fast',
  } as Resource,
  pinecone_rag: {
    kind: 'blog',
    title: 'Pinecone — RAG that actually works',
    url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
    hours: '1h',
    why: 'Production RAG patterns: chunking, hybrid, rerank, eval.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  ragas_docs: {
    kind: 'docs',
    title: 'Ragas — RAG evaluation library',
    url: 'https://docs.ragas.io/',
    why: 'Faithfulness, answer-relevancy, context-precision — the standard RAG metrics.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  bge_reranker: {
    kind: 'docs',
    title: 'BAAI BGE reranker — model card',
    url: 'https://huggingface.co/BAAI/bge-reranker-v2-m3',
    why: 'Strong open-weights cross-encoder reranker. Drop-in for production.',
    tier: 2,
    halfLife: 'fast',
  } as Resource,

  // ── Distributed ───────────────────────────────────────────────────────
  megatron_tp: {
    kind: 'paper',
    title: 'Megatron-LM — Training Multi-Billion Parameter Models',
    url: 'https://arxiv.org/abs/1909.08053',
    hours: '1.5h',
    why: '§2-3: the canonical tensor-parallel split for attention + MLP.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  nccl_docs: {
    kind: 'docs',
    title: 'NCCL — NVIDIA Collective Communications Library',
    url: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html',
    why: 'All-reduce, all-gather, ring vs tree. The primitives behind every parallelism scheme.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,
  weng_train_large: {
    kind: 'blog',
    title: 'Lilian Weng — How to Train Really Large Models on Many GPUs',
    url: 'https://lilianweng.github.io/posts/2021-09-25-train-large/',
    hours: '1h',
    why: 'DP/TP/PP/ZeRO in one sitting. Pair with Megatron paper.',
    tier: 1,
    halfLife: 'durable',
  } as Resource,

  // ── Interview prep ────────────────────────────────────────────────────
  huyen_ml_interview: {
    kind: 'book',
    title: 'Chip Huyen — Introduction to Machine Learning Interviews',
    url: 'https://huyenchip.com/ml-interviews-book/',
    hours: '8h',
    why: 'ML systems interview structure + system-design questions for ML roles.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  neetcode: {
    kind: 'course',
    title: 'NeetCode 150',
    url: 'https://neetcode.io/',
    hours: 'ongoing',
    why: 'Leetcode patterns. 30 min/day, mediums only.',
    tier: 1,
    halfLife: 'medium',
  } as Resource,
  donne_martin: {
    kind: 'repo',
    title: 'donnemartin/system-design-primer',
    url: 'https://github.com/donnemartin/system-design-primer',
    why: 'Generic system-design refresher; pair with ML-specific framings.',
    tier: 2,
    halfLife: 'medium',
  } as Resource,

  // ── Mosaic internal pointers ─────────────────────────────────────────
  mosaic_ml_execution: {
    kind: 'mosaic',
    title: 'Mosaic — ML Execution track',
    url: '/ml-execution',
    why: 'Your own notes on KV cache, paged attention, quant — keep in sync.',
    halfLife: 'medium',
  } as Resource,
  mosaic_applied: {
    kind: 'mosaic',
    title: 'Mosaic — Applied AI track',
    url: '/applied',
    why: 'RAG, agent patterns, OSS contribution playbook.',
    halfLife: 'medium',
  } as Resource,
  mosaic_compilers: {
    kind: 'mosaic',
    title: 'Mosaic — Compilers track',
    url: '/compilers',
    why: 'Triton / MLIR / XLA pointers for the W8 GPU intuition week.',
    halfLife: 'medium',
  } as Resource,
} as const

// ────────────────────────────────────────────────────────────────────────
// PATH — the 13-period (W0..W12) sprint.
// All periods are 'week' cadence — North has no quarters. The global spine
// is therefore a flat 13-week stretch matching the period numbers 1:1.
// ────────────────────────────────────────────────────────────────────────

export const PATH: Phase[] = [
  // ════════════════════════════════════════════════════════════════════
  // W0 — Sprint Calibration
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-0',
    title: 'Phase 0 — Sprint Calibration',
    blurb: 'Tracker, hardware, target list, baseline. Five days, no more.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'north-portfolio meta-repo + 15-name target company list + cloud GPU access',
    context:
      'No content yet — just the rails for a 90-day shipping sprint. If setup spills past the week, rip out the friction (different cloud, different account, simpler stack) before starting W1. The mistake is treating W0 as "preparing to start"; the right frame is "everything I need to run flat-out for 12 weeks is committed to git by Friday."',
    weeks: [
      {
        number: 0,
        title: 'Setup',
        goal:
          'Cloud GPU working. Portfolio repo + 4 project skeletons committed. 15 target companies + 10 OSS PR candidates listed. LinkedIn updated.',
        tasks: [
          {
            id: 'n-w0-r1',
            track: 'read',
            title: 'Weng — Large Transformer Inference Optimization (first pass)',
            body: 'Read once at normal speed. You will return to it every week of this sprint.',
            verify: 'One-paragraph summary of the four optimization axes (compute / memory / batching / quant) in your notes',
            hours: '1.5h',
            resources: [R.weng_inference],
          },
          {
            id: 'n-w0-r2',
            track: 'read',
            title: 'Survey the four serving stacks',
            body:
              'Open the README + top-level architecture doc for vLLM, SGLang, TGI, and llama.cpp. Do NOT clone yet. Just understand the shape: what is the engine boundary, what is the scheduler boundary, what is the OpenAI-compat layer.',
            verify: 'Table in notes: stack | language | scheduler | OpenAI-compat | TP support',
            hours: '1.5h',
            resources: [R.vllm_repo, R.sglang_repo, R.tgi_repo, R.llamacpp_repo],
          },
          {
            id: 'n-w0-b1',
            track: 'build',
            title: 'Cloud GPU working — Modal or RunPod, one H100 or A100',
            body:
              'Sign up, attach billing, run `nvidia-smi` from a container. The point is to verify you can spin a GPU on demand. Modal is the lowest-friction default; RunPod is the cheapest for sustained runs.',
            verify: '`modal run nvidia-smi` or equivalent prints H100/A100; cost ceiling alarm set',
            hours: '1h',
          },
          {
            id: 'n-w0-b2',
            track: 'build',
            title: 'north-portfolio meta-repo with four project skeletons',
            body:
              'Single GitHub org (or your account). One umbrella README that links the four flagship projects: mini-vllm, ai-gateway, rag-prod, dist-inference. Each project gets its own repo with a README stub stating goal + verify + bench plan. No code yet.',
            verify: 'Five public repos exist; umbrella README links them; each child README has a Verify + Bench section',
            hours: '1.5h',
          },
          {
            id: 'n-w0-b3',
            track: 'build',
            title: 'Baseline: run HF Llama-3-8B generate() on your GPU, get TTFT + ITL numbers',
            body:
              'No framework, no batching, no streaming — just `model.generate(...)` on a single prompt. Measure TTFT (time-to-first-token) and ITL (inter-token latency) at batch=1, prompt=512, gen=128. This is your starting baseline; every project will be measured against it.',
            verify: 'docs/baseline.md committed with hardware, model, dtype, TTFT, ITL, peak memory',
            hours: '2h',
            resources: [R.hf_generate],
          },
          {
            id: 'n-w0-a1',
            track: 'apply',
            title: 'LinkedIn headline + about → "LLM Infrastructure / Inference Engineer"',
            body:
              'No announcement post, no fanfare. Just hygiene: headline, about paragraph, experience descriptions that surface systems/infra work (perf, scale, latency, throughput, distributed). Strip generic "full-stack" language.',
            verify: 'Profile live; recruiter-search keywords (inference, vLLM, LLM serving, CUDA, Triton) present',
            hours: '1h',
          },
          {
            id: 'n-w0-a2',
            track: 'apply',
            title: 'Target list — 15 companies, 10 OSS PR candidates',
            body:
              'Companies: split into 5 frontier-lab (OAI/Anthropic/DeepMind/xAI/Mistral), 5 serving-infra (Together/Fireworks/Anyscale/Modal/Replicate/Baseten), 5 product (Cursor/Vercel/Linear/Notion/Perplexity). For each: role title, current openings URL, referrer candidate. OSS: 10 "good first issue" / "help wanted" tickets across vLLM/SGLang/TGI/llama.cpp.',
            verify: 'docs/targets.md committed with 15 companies + 10 issue URLs',
            hours: '2h',
          },
          {
            id: 'n-w0-p1',
            track: 'prep',
            title: 'Calendar block — 20h/wk for 12 weeks',
            body:
              'Recurring blocks. The plan assumes ~20 focused hours/wk. Block them as immovable. If your day job leaks past these blocks for two weeks in a row, the sprint is dead — say it out loud now.',
            verify: 'Recurring 20h/wk on calendar through W12',
            hours: '30m',
          },
          {
            id: 'n-w0-p2',
            track: 'prep',
            title: 'System-design notebook — one Obsidian/Notion file per question',
            body:
              'Pre-create 5 empty system-design pages, one per interview question you will study: (1) inference service, (2) AI gateway, (3) production RAG, (4) distributed batch inference, (5) embeddings serving. You will fill these across W4/W6/W7/W9/W11.',
            verify: 'Five empty pages exist with the same template (problem / constraints / arch / tradeoffs / numbers)',
            hours: '30m',
          },
          {
            id: 'n-w0-p3',
            track: 'prep',
            title: 'Subscribe — Interconnects, Import AI, GPU MODE, Hao AI lab',
            body:
              'The Living Layer (see disclosure above). 30 min/wk to skim. You cannot read every paper; you can read these four channels.',
            verify: 'RSS / email subs active; first issues skimmed',
            hours: '30m',
          },
        ],
        reading: [R.weng_inference, R.kipperly_speed, R.vllm_repo, R.openai_api_ref],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W1 — Inference Mental Model
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-1',
    title: 'Phase 1 — Inference Mental Model',
    blurb: 'KV cache + autoregressive mechanics, in your own code. Prefill vs decode, profiled.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'mini-vllm v0.1 — pure-PyTorch generate with explicit KV cache; profile in notes',
    context:
      'Before you can build a scheduler, you must feel the autoregressive loop in your fingertips. Prefill is parallel and compute-bound. Decode is serial and HBM-bound. The KV cache exists to convert decode from O(N²) to O(N). If you cannot explain that without looking it up, the rest of the sprint is built on sand.',
    weeks: [
      {
        number: 1,
        title: 'Autoregressive + KV cache, in code',
        goal:
          'A from-scratch generate() loop with an explicit KV cache running Llama-3-8B. Prefill vs decode profiled with numbers.',
        tasks: [
          {
            id: 'n-w1-r1',
            track: 'read',
            title: 'PagedAttention paper §1–3',
            body: 'Sections 1–3 only: the memory-management framing. Skip the eval section for now.',
            verify: 'Notes: KV cache size formula (2 · L · H · D · seq_len · dtype_bytes); fragmentation explanation in your own words',
            hours: '1.5h',
            resources: [R.pagedattention],
          },
          {
            id: 'n-w1-r2',
            track: 'read',
            title: 'Horace He — Brrr from First Principles',
            body: 'Compute / memory / overhead — the lens you will use for every benchmark this sprint.',
            verify: 'Notes: for Llama-3-8B fp16 decode at batch=1, predict which regime (compute / HBM / overhead) and justify',
            hours: '1h',
            resources: [R.kipperly_speed],
          },
          {
            id: 'n-w1-r3',
            track: 'read',
            title: 'HF transformers — modeling_llama.py generation path (skim)',
            body:
              'Trace `LlamaForCausalLM.forward` and `generate()`. Identify where the KV cache lives (past_key_values), how it grows, how attention is masked during prefill vs decode.',
            verify: 'Two-paragraph note describing prefill vs decode code paths and where they branch',
            hours: '1.5h',
            resources: [R.hf_generate],
          },
          {
            id: 'n-w1-b1',
            track: 'build',
            title: 'mini-vllm/engine.py — from-scratch generate() with explicit KV cache',
            body:
              'No `model.generate(...)`. Write the autoregressive loop yourself: prefill pass that fills the KV cache, then a decode loop that appends one token + one K/V slice per step. Match HF reference output for greedy decoding on 3 test prompts.',
            verify: 'pytest: greedy output matches HF reference exactly for 3 prompts; KV cache shape grows by 1 per decode step',
            hours: '5h',
            resources: [R.hf_generate],
          },
          {
            id: 'n-w1-b2',
            track: 'build',
            title: 'Profile prefill vs decode — three measurements',
            body:
              'Prompt=512, gen=128. Measure: (a) prefill latency (s), (b) per-decode-step latency (ms), (c) peak HBM. Compare to W0 baseline. Compute arithmetic intensity for prefill and decode and reason about which is HBM-bound.',
            verify: 'docs/profile.md committed with table + a one-line conclusion per measurement',
            hours: '2h',
            resources: [R.kipperly_speed, R.nsight_compute],
          },
          {
            id: 'n-w1-a1',
            track: 'apply',
            title: 'mini-vllm README — "What I built this week" section',
            body:
              'A README that is not aspirational. It says: this week I built X, here are the numbers, here is what I learned about the prefill/decode asymmetry, here is what is next. Plain language. No emojis.',
            verify: 'README pushed to mini-vllm repo; week-1 section ≤ 200 words with the profile numbers inline',
            hours: '1h',
          },
          {
            id: 'n-w1-p1',
            track: 'prep',
            title: 'vLLM source — read engine/llm_engine.py top-level loop',
            body:
              'Just read. No PR yet. Build a mental map: where is the scheduler called, where is the model executed, where do KV caches live. Sketch a one-page block diagram.',
            verify: 'docs/vllm-engine-sketch.md committed with a block diagram (ASCII or PNG)',
            hours: '2h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w1-p2',
            track: 'prep',
            title: 'Leetcode — start daily medium habit',
            body: '30 min/day, 4 days this week. Mediums only. Track in a sheet so streaks compound visibly.',
            verify: '4 mediums logged; one of them solved in <25 min',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.weng_inference, R.pagedattention, R.hf_generate, R.kipperly_speed],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W2 — Streaming Server + Naive Batching
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-2',
    title: 'Phase 2 — Streaming + Naive Batching',
    blurb: 'First OpenAI-compatible endpoint. SSE streaming. Static batching, on purpose.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.2 — FastAPI /v1/chat/completions with SSE, static batch=N',
    context:
      'Now the artifact starts looking like real serving infra. Token streaming is mandatory for any chat product. Static batching is the wrong long-term answer but the right learning step — you need to feel the head-of-line blocking problem before fixing it with continuous batching next week.',
    weeks: [
      {
        number: 2,
        title: 'OpenAI-compatible streaming server',
        goal:
          'A FastAPI server with /v1/chat/completions that streams tokens via SSE. Static batching across concurrent requests. Two known bugs documented.',
        tasks: [
          {
            id: 'n-w2-r1',
            track: 'read',
            title: 'OpenAI API reference — streaming chat completions',
            body:
              'Read the streaming event shape precisely. `data: {...}\\n\\n` framing, role in delta on first chunk, finish_reason on last. Test clients break in subtle ways if you get this wrong.',
            verify: 'Notes: SSE event shape with example bytes; finish_reason values listed',
            hours: '1h',
            resources: [R.openai_api_ref],
          },
          {
            id: 'n-w2-r2',
            track: 'read',
            title: 'Anyscale — How continuous batching enables 23x throughput',
            body:
              'Skim now (you implement continuous batching W4). Goal this week: understand WHY static batching wastes throughput so when you build it you feel the pain.',
            verify: 'One-paragraph note: static batching\'s failure mode (head-of-line, generation-length variance)',
            hours: '45m',
            resources: [R.anyscale_batching],
          },
          {
            id: 'n-w2-r3',
            track: 'read',
            title: 'FastAPI docs — async + StreamingResponse',
            body: 'Specifically the SSE patterns. Async generators, backpressure, client-disconnect handling.',
            verify: 'Notes: how StreamingResponse handles client disconnect; one-line summary',
            hours: '45m',
            resources: [R.fastapi_docs],
          },
          {
            id: 'n-w2-b1',
            track: 'build',
            title: 'FastAPI server — /v1/chat/completions, non-streaming first',
            body:
              'Wire the W1 engine behind a single endpoint. Match OpenAI request/response shape exactly. Test with `openai` Python client pointing at your URL.',
            verify: '`openai.chat.completions.create(...)` against your server returns a valid ChatCompletion',
            hours: '3h',
            resources: [R.fastapi_docs, R.openai_api_ref],
          },
          {
            id: 'n-w2-b2',
            track: 'build',
            title: 'Add SSE streaming — stream=True path',
            body:
              'Async generator yielding `data: {json}\\n\\n` chunks. Token-by-token. Handle client disconnect gracefully (cancel generation, free KV cache).',
            verify: '`openai` client with `stream=True` prints tokens incrementally; killing client mid-stream frees KV in your logs',
            hours: '3h',
            resources: [R.fastapi_docs, R.openai_api_ref],
          },
          {
            id: 'n-w2-b3',
            track: 'build',
            title: 'Static batching — collect N requests, run together',
            body:
              'Simple: a request queue + a background coroutine that waits up to T ms or until N requests arrive, then runs them as one batch. Same generation length for all (left-pad inputs). You will hate this by Friday — that is the point.',
            verify: 'At N=4, throughput (tok/s aggregate) ≥ 2.5× single-request; latency for first-arriving request increases by ≤ T ms',
            hours: '3h',
          },
          {
            id: 'n-w2-a1',
            track: 'apply',
            title: 'Demo — short Loom of streaming + concurrent requests',
            body:
              '3 minutes max. Show the streaming endpoint. Show 4 concurrent requests. Show your throughput number on screen. Embed link in README.',
            verify: 'Loom link in mini-vllm README; thumbnail visible on repo page',
            hours: '45m',
          },
          {
            id: 'n-w2-a2',
            track: 'apply',
            title: 'BENCHMARKS.md — first real entry',
            body:
              'Hardware row, dtype row. Three rows for batch=1/4/16 with TTFT, ITL, throughput, peak HBM. Note the static-batching head-of-line issue at the bottom.',
            verify: 'BENCHMARKS.md committed; numbers reproducible from a single command',
            hours: '1.5h',
          },
          {
            id: 'n-w2-p1',
            track: 'prep',
            title: 'vLLM scheduler — read core/scheduler.py',
            body:
              'Just read. Identify the iteration loop, the running/waiting/swapped queues, and the preemption logic. Compare to your static batcher and write down the three things vLLM does that you do not.',
            verify: 'docs/vllm-scheduler-notes.md with the three gaps listed',
            hours: '2h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w2-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved this week',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.orca, R.anyscale_batching, R.openai_api_ref, R.fastapi_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W3 — Paged KV Cache
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-3',
    title: 'Phase 3 — Paged KV Cache',
    blurb: 'Implement paged attention\'s memory manager. Understand block tables in your code.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.3 — PagedKVManager with block tables, alloc/free, optional prefix sharing',
    context:
      'PagedAttention\'s contribution is not a kernel — it is a memory manager that treats KV cache like virtual memory. Once the block table exists, prefix sharing, swapping, and OOM-free batching all fall out for free. This is the single most important week of the sprint for the "I understand modern serving" interview signal.',
    weeks: [
      {
        number: 3,
        title: 'Paged KV — block tables and the memory manager',
        goal:
          'A PagedKVManager class with block_size, num_blocks, alloc/free, and a block_table per sequence. Wire it into your engine. No fragmentation, OOM raised cleanly.',
        tasks: [
          {
            id: 'n-w3-r1',
            track: 'read',
            title: 'PagedAttention paper — full read this time',
            body: 'Including §4 (block table mechanics) and §5 (eval). The block-table data structure is the artifact you are about to build.',
            verify: 'Notes: block_size tradeoffs; how copy-on-write enables parallel sampling',
            hours: '2h',
            resources: [R.pagedattention],
          },
          {
            id: 'n-w3-r2',
            track: 'read',
            title: 'vLLM — attention/backends + block_manager',
            body:
              'Read `vllm/core/block_manager.py` and one backend (e.g. `attention/backends/flash_attn.py`). Understand the producer/consumer between the manager and the kernel.',
            verify: 'docs/vllm-block-manager.md sketches the class API + how block_tables are passed to the kernel',
            hours: '2h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w3-b1',
            track: 'build',
            title: 'PagedKVManager class — alloc / free / block_table',
            body:
              'block_size=16 (configurable). A free-list of physical block ids. Per-sequence block_table = list[block_id]. `allocate(seq_id, num_tokens)` extends as needed; `free(seq_id)` returns blocks to the pool.',
            verify: 'Unit tests: random alloc/free pattern over 1000 ops never leaks; OOM raises ValueError cleanly',
            hours: '4h',
          },
          {
            id: 'n-w3-b2',
            track: 'build',
            title: 'Wire PagedKVManager into the engine',
            body:
              'Replace the dense per-sequence KV tensor with a global K/V pool of shape (num_blocks, block_size, num_heads, head_dim). Attention now gathers from blocks via block_table. Use a simple Python gather first; xformers/Flash-Attn paged kernels are W5.',
            verify: 'mini-vllm still matches HF reference output exactly on the 3 W1 test prompts',
            hours: '4h',
          },
          {
            id: 'n-w3-b3',
            track: 'build',
            title: 'Concurrent requests — KV cache no longer OOMs at batch=16',
            body:
              'Before: dense KV per sequence wastes memory proportional to max_seq_len. After: paging means you only consume blocks proportional to actual tokens. Demonstrate this with a memory plot.',
            verify: 'BENCHMARKS.md updated: peak HBM at batch=16 drops by ≥ 30% vs W2 baseline',
            hours: '2h',
          },
          {
            id: 'n-w3-b4',
            track: 'build',
            title: 'Optional — prefix caching for shared system prompts',
            body:
              'If a request prefix matches an existing block sequence (hash the token ids), reuse those blocks (refcount +1). Free when refcount drops to 0. This is the SGLang RadixAttention idea in its simplest form.',
            verify: 'Test: two requests with the same 200-token system prompt share blocks; second request TTFT drops by ≥ 40%',
            hours: '3h',
            resources: [R.sglang_repo],
          },
          {
            id: 'n-w3-a1',
            track: 'apply',
            title: 'Write-up — "Paged KV cache in 400 lines of Python"',
            body:
              'A blog-style README section (or separate post). Show the block_table diagram. Explain why it works. Show the memory plot. Link the code. This is the first artifact a serving-team hiring manager will skim. Make it scannable.',
            verify: 'docs/paged-kv-writeup.md ≤ 1500 words with one diagram and one chart',
            hours: '2h',
          },
          {
            id: 'n-w3-p1',
            track: 'prep',
            title: 'OSS scouting — find one realistic vLLM PR',
            body:
              'Browse vLLM "good first issue" + "help wanted". Find one ticket where the scope is real (not "fix typo") but bounded (one file, one test). Comment on it expressing intent. Do not start work yet — you commit W10.',
            verify: 'Comment posted on a single issue; URL saved to docs/targets.md',
            hours: '1.5h',
            resources: [R.vllm_repo],
          },
          {
            id: 'n-w3-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved this week',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.pagedattention, R.vllm_repo, R.sglang_repo, R.mosaic_ml_execution],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W4 — Continuous Batching + Scheduler
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-4',
    title: 'Phase 4 — Continuous Batching + Scheduler',
    blurb: 'Iteration-level batching. Chunked prefill. The hot loop that defines modern serving.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.4 — continuous-batching scheduler with prefill/decode mix + chunked prefill',
    context:
      'Continuous batching is the single highest-leverage idea in modern LLM serving. Once you have paged KV + iteration-level scheduling, you have rebuilt the core of vLLM/SGLang/TGI. This week is also when your throughput numbers start being interview-worthy.',
    weeks: [
      {
        number: 4,
        title: 'Continuous batching + chunked prefill',
        goal:
          'A scheduler that admits requests at every iteration, mixes prefill and decode in one step, and chunks long prefills. Throughput chart that beats W2 static batching by ≥ 3×.',
        tasks: [
          {
            id: 'n-w4-r1',
            track: 'read',
            title: 'Orca paper §1–3',
            body: 'The iteration-level scheduling idea, in its original form. Required.',
            verify: 'Notes: iteration-level vs request-level scheduling, one paragraph each, contrasted',
            hours: '1.5h',
            resources: [R.orca],
          },
          {
            id: 'n-w4-r2',
            track: 'read',
            title: 'Sarathi-Serve paper',
            body:
              'Chunked prefill — why mixing prefill chunks into decode batches keeps GPU utilization high without bloating decode latency.',
            verify: 'Notes: chunked-prefill tradeoffs; pick a chunk_size and justify it',
            hours: '1.5h',
            resources: [R.sarathi_serve],
          },
          {
            id: 'n-w4-r3',
            track: 'read',
            title: 'vLLM v1 engine RFC + SGLang scheduler blog',
            body:
              'Read both. Two different scheduler designs solving the same problem. You will internalize the tradeoffs better by seeing both than by reading either alone.',
            verify: 'docs/scheduler-comparison.md with a 3-row table (vLLM v0 / vLLM v1 / SGLang) on scheduling policy',
            hours: '2h',
            resources: [R.vllm_repo, R.sglang_repo],
          },
          {
            id: 'n-w4-b1',
            track: 'build',
            title: 'Scheduler — iteration-level admission',
            body:
              'Replace W2 static batcher. At every model step: (1) admit waiting requests up to budget, (2) decode current running set, (3) free completed requests, (4) yield streams. Single GIL-friendly Python loop is fine — no asyncio gymnastics.',
            verify: 'Throughput at 32 concurrent variable-length requests ≥ 3× W2 static-batching baseline',
            hours: '5h',
          },
          {
            id: 'n-w4-b2',
            track: 'build',
            title: 'Chunked prefill — split long prompts across iterations',
            body:
              'If a waiting request has prompt > chunk_size, schedule chunk_size of its prefill alongside running decodes. Tune chunk_size for your hardware (start 512).',
            verify: 'P99 ITL for decode-only requests does NOT degrade when a long-prompt request enters; chart in BENCHMARKS.md',
            hours: '3h',
            resources: [R.sarathi_serve],
          },
          {
            id: 'n-w4-b3',
            track: 'build',
            title: 'Token budget per iteration — soft cap',
            body:
              'Set a per-iteration token budget (e.g., 8192). Scheduler must fit running decodes + new prefill chunks under this cap. Avoids OOM and stabilizes latency.',
            verify: 'OOM-free at 64 concurrent long-context requests; budget hit rate logged',
            hours: '2h',
          },
          {
            id: 'n-w4-a1',
            track: 'apply',
            title: 'BENCHMARKS.md — the headline chart',
            body:
              'Throughput vs concurrency curve, batch=1..64. Three lines: W2 static, W3 paged-no-CB, W4 continuous-batching. The shape of these lines IS your interview pitch — practice describing it out loud.',
            verify: 'Chart committed (PNG + the python script that generates it); one-paragraph narrative below it',
            hours: '2h',
          },
          {
            id: 'n-w4-a2',
            track: 'apply',
            title: 'Outreach round 1 — 5 referrer-target DMs',
            body:
              'Pick 5 people from your target-company list who work in inference/serving. Short DM: "I am building a vLLM-style engine to learn the lane, here is the BENCHMARKS chart, can I ask one specific question about your team\'s scheduler?" The chart is what earns the reply.',
            verify: '5 DMs sent; replies tracked in docs/outreach.md',
            hours: '1.5h',
          },
          {
            id: 'n-w4-p1',
            track: 'prep',
            title: 'System-design page 1 — "Design an LLM inference service"',
            body:
              'Fill the empty W0 page. Constraints (1k QPS, p99 TTFT, p99 ITL, cost ceiling). Components (LB → scheduler → model worker → KV manager). Bottlenecks. Failure modes. Practice presenting in 25 min.',
            verify: 'Page filled; 25-min self-presentation rehearsed and timed',
            hours: '2.5h',
            resources: [R.huyen_ml_interview],
          },
          {
            id: 'n-w4-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.orca, R.sarathi_serve, R.vllm_repo, R.sglang_repo],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W5 — Quantization OR Speculative Decoding (pick one)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-5',
    title: 'Phase 5 — Inference Accelerator',
    blurb: 'Pick one: quantization (INT8/INT4) or speculative decoding. Ship it with numbers.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-execution)',
    artifact: 'mini-vllm v0.5 — INT8 weight-only quant OR speculative decoding with a draft model',
    context:
      'Do not try both. A shipped quant story with a memory plot and a quality eval beats half-built quant + half-built specdec every time. Quant is the safer bet for hiring signal (universal in production); spec-decoding is sexier but trickier to integrate cleanly. Choose by Monday.',
    weeks: [
      {
        number: 5,
        title: 'One accelerator, shipped',
        goal:
          'Either INT8 weight-only with bitsandbytes/torchao, OR speculative decoding with a small draft model. Memory + throughput + quality numbers committed.',
        tasks: [
          {
            id: 'n-w5-r1',
            track: 'read',
            title: 'AWQ + GPTQ overview',
            body:
              'Read AWQ §1-3 and the GPTQ overview. Goal: understand calibration sets, group sizes, the accuracy/throughput tradeoff. You probably will not implement either from scratch — you will use a library — but you must reason about which to pick.',
            verify: 'Notes: AWQ vs GPTQ decision tree (when to use which)',
            hours: '1.5h',
            resources: [R.awq, R.gptq],
          },
          {
            id: 'n-w5-r2',
            track: 'read',
            title: 'Speculative decoding — Leviathan + Medusa',
            body:
              'Even if you pick the quant track, read these. The verification trick (draft proposes N tokens, target verifies in one forward pass) is a classic systems-meets-ML idea.',
            verify: 'One-paragraph note: why specdec is free for memory-bound decode but not for compute-bound prefill',
            hours: '1.5h',
            resources: [R.leviathan_spec, R.medusa, R.eagle],
          },
          {
            id: 'n-w5-b1',
            track: 'build',
            title: 'Decide: quant OR specdec. Commit Monday.',
            body:
              'Write a 200-word decision doc. Stop second-guessing after Monday. The hire signal is "shipped one well" not "started two".',
            verify: 'docs/w5-decision.md committed Monday EOD',
            hours: '1h',
          },
          {
            id: 'n-w5-b2',
            track: 'build',
            title: 'Quant track — INT8 weight-only with bitsandbytes or torchao',
            body:
              'Load Llama-3-8B with int8 weights. Activations stay fp16/bf16. Verify it integrates with your paged KV + continuous batcher (it should — only the linear layers change).',
            verify:
              'Quant model boots; greedy output matches fp16 on the 3 W1 prompts within edit-distance 5; peak HBM drops ≥ 35%',
            hours: '4h',
            resources: [R.awq, R.gptq],
          },
          {
            id: 'n-w5-b3',
            track: 'build',
            title: 'Specdec track — small draft model + verification step',
            body:
              'Llama-3-8B target, TinyLlama or Llama-3-8B-distilled as draft. Draft proposes K=4 tokens, target verifies in one forward, accept up to first rejection. The acceptance loop is ~100 lines once your engine supports two model handles.',
            verify:
              'Greedy output identical to non-specdec at temperature 0; observed tokens/sec increase by ≥ 1.5× at batch=1',
            hours: '5h',
            resources: [R.leviathan_spec, R.medusa],
          },
          {
            id: 'n-w5-b4',
            track: 'build',
            title: 'Quality eval — MT-Bench subset or in-house golden set',
            body:
              'Pick 30 prompts. Run pre- and post-acceleration. Score with a judge model (GPT-4o or Claude). Quant should be ≤ 1% degradation; specdec at T=0 should be identical.',
            verify: 'docs/quality-eval.md with per-prompt scores and aggregate delta',
            hours: '2h',
          },
          {
            id: 'n-w5-a1',
            track: 'apply',
            title: 'BENCHMARKS.md — the accelerator section',
            body:
              'Before/after table: throughput, peak HBM, p99 ITL, quality delta. The quality column is the one that makes this credible — without it, recruiters assume you broke the model.',
            verify: 'Four-column section pushed; numbers reproducible',
            hours: '1.5h',
          },
          {
            id: 'n-w5-a2',
            track: 'apply',
            title: 'mini-vllm v0.5 release — tag + changelog',
            body:
              'Git tag v0.5. CHANGELOG entry. Update repo description ("OpenAI-compatible LLM serving engine with paged KV + continuous batching + INT8/specdec — built to learn the lane"). This is the version you start linking from applications.',
            verify: 'v0.5 tag exists on GitHub; repo description updated',
            hours: '45m',
          },
          {
            id: 'n-w5-p1',
            track: 'prep',
            title: 'Behavioral STAR stories — draft 6',
            body:
              'Six 90-second stories: ambiguity, conflict, failure, scope-cut, perf-win, mentorship. From your existing 6yr SWE career, not from this sprint. Practice out loud once each.',
            verify: 'docs/behavioral.md with six STAR-shaped entries',
            hours: '2h',
          },
          {
            id: 'n-w5-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.awq, R.leviathan_spec, R.medusa, R.eagle],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W6 — AI Gateway / Model Router
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-6',
    title: 'Phase 6 — AI Gateway',
    blurb: 'Project 2. Production-grade router across hosted + local models. Cost, retry, cache, OTel.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'ai-gateway — Python service routing across OpenAI/Anthropic/local mini-vllm with full prod patterns',
    context:
      'Every serious AI product has a gateway in front of model providers. Cost ledger, retry-with-fallback, semantic cache, rate limit, OTel traces. This project is the one that signals "I can build the platform layer." It also stress-tests your mini-vllm — you will use it as the local backend.',
    weeks: [
      {
        number: 6,
        title: 'AI Gateway — the platform layer',
        goal:
          'A single service that exposes /v1/chat/completions, routes intelligently across providers, retries with fallback, caches, tracks cost, emits OTel traces, enforces rate limits.',
        tasks: [
          {
            id: 'n-w6-r1',
            track: 'read',
            title: 'LiteLLM Router — read the source',
            body:
              'Specifically `litellm/router.py`. Understand the routing strategies (least-busy, weighted, latency-based), the cooldown logic, the fallback chain.',
            verify: 'docs/litellm-router-notes.md with the four routing strategies summarized',
            hours: '2h',
            resources: [R.litellm_repo],
          },
          {
            id: 'n-w6-r2',
            track: 'read',
            title: 'Portkey + Cloudflare AI Gateway docs',
            body: 'Two commercial reference architectures. Steal the features list (semantic cache, guardrails, observability) for your own design.',
            verify: 'docs/gateway-features.md with a checked list of which features you will implement vs skip',
            hours: '1h',
            resources: [R.portkey_gateway, R.cf_ai_gateway],
          },
          {
            id: 'n-w6-r3',
            track: 'read',
            title: 'OpenTelemetry Python — traces + metrics intro',
            body: 'Just enough to instrument route handlers with spans and counters. You will export to a local Jaeger or Tempo.',
            verify: 'Notes: trace context propagation across async calls in one paragraph',
            hours: '1h',
            resources: [R.otel_docs],
          },
          {
            id: 'n-w6-b1',
            track: 'build',
            title: 'ai-gateway skeleton — FastAPI, three providers, one route',
            body:
              'Single endpoint /v1/chat/completions. Provider abstraction with three impls: OpenAI, Anthropic, local-vllm (your W5). Config-driven model list.',
            verify: 'Same request hits all three providers via `model=` switch; OpenAI-compatible response shape',
            hours: '3h',
          },
          {
            id: 'n-w6-b2',
            track: 'build',
            title: 'Routing + fallback + retry',
            body:
              'Strategy: cost-aware primary + capability-fallback. Retry on 429/5xx with exponential backoff. Fallback chain on persistent failure. Cooldown a provider for N seconds after error rate threshold.',
            verify: 'Chaos test: kill OpenAI mock midstream → request resolves via Anthropic within 2 retries; trace shows the path',
            hours: '4h',
          },
          {
            id: 'n-w6-b3',
            track: 'build',
            title: 'Semantic cache',
            body:
              'Embed request prompt with a tiny embedding model, cosine-search against a Redis-backed cache, return cached completion if similarity > τ. Configurable per-route. Avoid caching streaming responses for v1.',
            verify: 'Hit rate ≥ 30% on a repeated FAQ workload; cached response served < 50ms',
            hours: '3h',
          },
          {
            id: 'n-w6-b4',
            track: 'build',
            title: 'Cost ledger + OTel traces',
            body:
              'Per-request: input tokens × input price + output tokens × output price → cost. Append to a SQLite/Postgres ledger. Emit OTel spans with provider, latency, tokens, cost as attributes. Local Jaeger for inspection.',
            verify: '`/admin/costs?since=...` returns aggregate cost; Jaeger UI shows traces with cost on each span',
            hours: '3h',
            resources: [R.otel_docs],
          },
          {
            id: 'n-w6-b5',
            track: 'build',
            title: 'Rate limiting — token-bucket per API key',
            body: 'Per-key RPM + TPM limits. Return 429 with Retry-After header. Test under load.',
            verify: 'Under 2× limit traffic, exactly the over-limit fraction gets 429; under limit, 0% rejection',
            hours: '2h',
          },
          {
            id: 'n-w6-a1',
            track: 'apply',
            title: 'ai-gateway README — arch diagram + numbers',
            body:
              'Architecture diagram (Excalidraw or Mermaid). Numbers table: cost saved by cache, latency added by gateway (p50/p99), fallback success rate during chaos test.',
            verify: 'README pushed; diagram embedded; numbers committed',
            hours: '1.5h',
          },
          {
            id: 'n-w6-a2',
            track: 'apply',
            title: 'Outreach round 2 — 5 more DMs, this time with both projects',
            body: 'Link mini-vllm AND ai-gateway. Same short template; the artifact list is doing the talking now.',
            verify: '5 DMs sent; replies tracked',
            hours: '1.5h',
          },
          {
            id: 'n-w6-p1',
            track: 'prep',
            title: 'System-design page 2 — "Design an AI Gateway"',
            body:
              'Fill the empty W0 page. Use ai-gateway as the body. Constraints (10k RPS, multi-tenant, p99 added latency < 50ms). Cache invalidation strategy. Multi-region deploy.',
            verify: 'Page filled; rehearsed in 25 min',
            hours: '2.5h',
          },
          {
            id: 'n-w6-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.litellm_repo, R.portkey_gateway, R.cf_ai_gateway, R.otel_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W7 — Production RAG
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-7',
    title: 'Phase 7 — Production RAG',
    blurb: 'Project 3. Hybrid retrieval, reranker, eval harness. Evals first. Not a toy chatbot.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'rag-prod — ingestion + hybrid retrieval + reranker + ragas eval dashboard + citations',
    context:
      'Most "RAG projects" online are toys. The hire signal here is: you built the eval harness FIRST, then iterated retrieval/reranking against measurable precision@k and faithfulness gains. The numbers on the eval dashboard are what convinces a platform team you understand AI quality engineering.',
    weeks: [
      {
        number: 7,
        title: 'Eval-driven RAG, end to end',
        goal:
          '50-question gold eval set. Ingestion pipeline. BM25 + dense hybrid. Cross-encoder rerank. Structured outputs with citations. Dashboard showing precision@k, recall@k, faithfulness, answer correctness with deltas across iterations.',
        tasks: [
          {
            id: 'n-w7-r1',
            track: 'read',
            title: 'Pinecone — RAG that actually works',
            body: 'Production patterns: chunking strategies, hybrid scoring, rerank, eval. The most practical single read on RAG.',
            verify: 'Notes: chunking strategies table (fixed / semantic / hierarchical / contextual) with one tradeoff each',
            hours: '1h',
            resources: [R.pinecone_rag],
          },
          {
            id: 'n-w7-r2',
            track: 'read',
            title: 'Anthropic — Contextual Retrieval',
            body: 'Prompt-based chunk enrichment. Implement if it fits your domain corpus.',
            verify: 'Notes: when contextual retrieval beats plain hybrid; when it does not',
            hours: '45m',
            resources: [R.anthropic_contextual],
          },
          {
            id: 'n-w7-r3',
            track: 'read',
            title: 'Ragas docs',
            body: 'The four key metrics: faithfulness, answer-relevancy, context-precision, context-recall. Read once carefully.',
            verify: 'Notes: one paragraph per metric in your own words',
            hours: '45m',
            resources: [R.ragas_docs],
          },
          {
            id: 'n-w7-b1',
            track: 'build',
            title: 'Pick a corpus + write 50-Q gold set',
            body:
              'Corpus = something you actually care about (e.g., Mosaic content, Kubernetes docs, a sport rulebook). 50 questions with gold answers + gold source-doc references. This is the artifact that lets you iterate honestly.',
            verify: 'gold.jsonl committed; 50 entries with question + answer + source_doc_ids',
            hours: '4h',
          },
          {
            id: 'n-w7-b2',
            track: 'build',
            title: 'Ingestion pipeline — chunk, embed, store',
            body:
              'Chunk size 512 with overlap 64 (or contextual chunking if you implement Anthropic\'s trick). Embed with bge-base or text-embedding-3-small. Store in a vector DB (Qdrant local is easiest) + BM25 index (rank_bm25 or OpenSearch).',
            verify: 'Re-ingestion is idempotent; corpus stats in docs/corpus.md',
            hours: '3h',
          },
          {
            id: 'n-w7-b3',
            track: 'build',
            title: 'Hybrid retrieval + cross-encoder reranker',
            body:
              'Retrieve top-50 via dense AND top-50 via BM25, RRF fuse to top-20, rerank with bge-reranker-v2-m3 to top-5. Pass top-5 to the LLM via your ai-gateway with a structured-output schema that requires citations.',
            verify: 'End-to-end query returns answer + citations array; latency p99 < 1.5s on local corpus',
            hours: '4h',
            resources: [R.bge_reranker],
          },
          {
            id: 'n-w7-b4',
            track: 'build',
            title: 'Eval dashboard — ragas + your gold set',
            body:
              'Run ragas faithfulness, answer-relevancy, context-precision, context-recall against the 50-Q gold set. Also compute retrieval precision@5 and recall@5 vs gold doc ids. Dashboard = a simple Streamlit or a markdown table committed per iteration.',
            verify: 'Three rows in the table: (1) BM25 only, (2) dense only, (3) hybrid+rerank — with all four ragas metrics + retrieval precision/recall',
            hours: '3h',
            resources: [R.ragas_docs],
          },
          {
            id: 'n-w7-a1',
            track: 'apply',
            title: 'rag-prod README — eval-first narrative',
            body:
              'Lead with the dashboard. Show how each component (hybrid, rerank, contextual chunking) moved which number. This is the writeup that signals "I think in evals."',
            verify: 'README ≤ 1500 words; dashboard PNG embedded; delta table visible above the fold',
            hours: '1.5h',
          },
          {
            id: 'n-w7-a2',
            track: 'apply',
            title: 'Applications — first 5',
            body:
              'Five real applications this week. Tailored cover note (3 sentences) referencing one specific thing the team works on. Link mini-vllm + ai-gateway + rag-prod.',
            verify: '5 applications submitted; docs/applications.md tracker started',
            hours: '2h',
          },
          {
            id: 'n-w7-p1',
            track: 'prep',
            title: 'System-design page 3 — "Design Production RAG"',
            body:
              'Fill the W0 page. Constraints (10M docs, 100 QPS, p99 < 2s, freshness < 1hr). Eval pipeline as a first-class component, not an afterthought.',
            verify: 'Page filled; rehearsed in 25 min',
            hours: '2.5h',
          },
          {
            id: 'n-w7-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.pinecone_rag, R.anthropic_contextual, R.ragas_docs, R.bge_reranker],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W8 — GPU / Runtime Intuition
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-8',
    title: 'Phase 8 — GPU Intuition',
    blurb: 'Enough GPU depth to interview credibly. Read FlashAttention. Write one Triton kernel.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-compilers)',
    artifact: 'kernels/ directory in mini-vllm — Triton softmax + matmul-bias with roofline analysis',
    context:
      'For the AI Systems Engineer lane (not the dedicated kernel engineer lane), one well-understood Triton kernel + a roofline reading habit is enough. You are not competing with CUTLASS authors. You are demonstrating that you can read a kernel, predict its regime, and verify with NCU.',
    weeks: [
      {
        number: 8,
        title: 'Triton kernel + roofline reading',
        goal:
          'A Triton softmax and a Triton matmul-bias kernel within 70% of torch reference. One NCU report committed showing TC utilization on the matmul. One roofline writeup.',
        tasks: [
          {
            id: 'n-w8-r1',
            track: 'read',
            title: 'FlashAttention-2 paper §3',
            body:
              'Tiling + IO-aware attention. You will not implement FA2 — you will use it as the canonical example of an IO-aware kernel for your roofline writeup.',
            verify: 'Notes: why FA2 is faster than naive attention despite doing strictly more FLOPs',
            hours: '2h',
            resources: [R.flashattention2],
          },
          {
            id: 'n-w8-r2',
            track: 'read',
            title: 'GPU MODE lectures 1 + 2',
            body: 'Memory hierarchy mapped to ML workloads. The bandwidth pyramid. Watch with notes open.',
            verify: 'Sketch of the H100 bandwidth pyramid with numbers (HBM3, L2, SMEM, registers) committed',
            hours: '2h',
            resources: [R.gpu_mode],
          },
          {
            id: 'n-w8-r3',
            track: 'read',
            title: 'Triton tutorials — vector add → softmax → matmul',
            body: 'Three tutorials, in order. Type the code, do not paste. Goal: build the muscle for tile sizes, BLOCK constants, and program_id math.',
            verify: 'All three tutorials run on your GPU; matmul within 80% of cuBLAS',
            hours: '3h',
            resources: [R.triton_docs],
          },
          {
            id: 'n-w8-b1',
            track: 'build',
            title: 'kernels/softmax_triton.py',
            body: 'Fused softmax along the last axis. Numerically stable (subtract max). Use shared memory via the tl.load/store tile API.',
            verify: 'matches torch.softmax to 1e-5 atol; within 80% of torch on M×N where N=2048',
            hours: '3h',
            resources: [R.triton_docs],
          },
          {
            id: 'n-w8-b2',
            track: 'build',
            title: 'kernels/matmul_bias_triton.py',
            body:
              'fp16 matmul with fused bias add. Tune BLOCK_M/N/K. Use the tutorial autotune. Verify against torch.matmul + bias.',
            verify: 'Matches torch within 1e-3 rtol; achieves ≥ 70% of cuBLAS+bias on (M, N, K) = (4096, 4096, 4096)',
            hours: '4h',
            resources: [R.triton_docs],
          },
          {
            id: 'n-w8-b3',
            track: 'build',
            title: 'NCU profile of the matmul — TC utilization check',
            body:
              'Run `ncu --set full python kernels/bench_matmul.py`. Find the SM__pipe_tensor_op metric. Verify Tensor Cores are actually engaged (not falling back to CUDA cores).',
            verify: 'docs/ncu-report.md committed with the TC % number and a one-paragraph interpretation',
            hours: '2h',
            resources: [R.nsight_compute],
          },
          {
            id: 'n-w8-a1',
            track: 'apply',
            title: 'Writeup — "Roofline for an inference kernel author"',
            body:
              'Short post. The H100 ridge point ≈ AI of 295 FLOPs/byte (fp16). Show: your matmul\'s observed AI, the regime it sits in, the gap from peak, and what you would tune next. One diagram. This is the writeup that gets re-shared.',
            verify: 'docs/roofline-writeup.md ≤ 1200 words; one chart',
            hours: '2h',
            resources: [R.kipperly_speed, R.flashattention2],
          },
          {
            id: 'n-w8-a2',
            track: 'apply',
            title: 'Applications — 5 more',
            body: 'Tailored as before. Now you can mention "wrote my own Triton matmul" in the cover note for serving-infra companies.',
            verify: '5 applications submitted',
            hours: '2h',
          },
          {
            id: 'n-w8-p1',
            track: 'prep',
            title: 'Mock interview slot — book one',
            body:
              'Use Pramp, interviewing.io, or a peer. Book one slot in W11. Yes, four weeks out. It will arrive faster than you expect.',
            verify: 'Mock interview booked; calendar invite saved',
            hours: '30m',
          },
          {
            id: 'n-w8-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.flashattention2, R.flashattention3, R.gpu_mode, R.triton_docs, R.nsight_compute, R.mosaic_compilers],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W9 — Distributed Inference
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-9',
    title: 'Phase 9 — Distributed Inference',
    blurb: 'Project 4. Multi-worker replica serving OR 2-GPU tensor parallelism. Scaling bench.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-architecture)',
    artifact: 'dist-inference — replica router with consistent hashing + queue, OR 2-GPU TP for a small model',
    context:
      'Pick replica-serving if you have 1 GPU (cheap to demonstrate via process-level replicas). Pick TP if you have 2 GPUs (more impressive, harder to debug). Either way: the artifact is a scaling chart, not the parallelism itself.',
    weeks: [
      {
        number: 9,
        title: 'Multi-worker serving with a scaling chart',
        goal:
          'Either: a replica router with consistent hashing + per-replica queue + health checks, OR a 2-GPU TP implementation for a small model. Scaling chart in BENCHMARKS.md.',
        tasks: [
          {
            id: 'n-w9-r1',
            track: 'read',
            title: 'Pope et al — Efficiently Scaling Transformer Inference',
            body:
              'Google\'s analytical framework. The cost-per-token math is exactly what you would draw on a whiteboard in an inference-infra system-design interview.',
            verify: 'Notes: communication cost vs compute cost as model/batch grows, in one paragraph',
            hours: '2h',
            resources: [R.pope_efficient],
          },
          {
            id: 'n-w9-r2',
            track: 'read',
            title: 'Megatron-LM TP paper §2-3 + Weng training large models',
            body: 'The canonical TP split. Read once, then read it again next to the vLLM TP impl.',
            verify: 'Notes: how TP splits attention vs MLP; which all-reduce sits where',
            hours: '2h',
            resources: [R.megatron_tp, R.weng_train_large],
          },
          {
            id: 'n-w9-r3',
            track: 'read',
            title: 'NCCL docs — collectives overview',
            body: 'all-reduce, all-gather, ring vs tree. Bandwidth-vs-latency tradeoff at the topology level.',
            verify: 'Notes: when ring beats tree and vice versa',
            hours: '1h',
            resources: [R.nccl_docs],
          },
          {
            id: 'n-w9-b1',
            track: 'build',
            title: 'Pick: replica-serving OR 2-GPU TP. Commit Monday.',
            body:
              'Replica-serving = process-level replicas behind a router (works on 1 GPU; demonstrates dispatch). 2-GPU TP = the real thing (requires 2 GPUs; demonstrates collective math).',
            verify: 'docs/w9-decision.md committed Monday EOD',
            hours: '1h',
          },
          {
            id: 'n-w9-b2',
            track: 'build',
            title: 'Replica track — router + N workers + queue',
            body:
              'N mini-vllm worker processes. Front router (FastAPI). Consistent-hash by request id for cache locality. Per-worker queue with backpressure. Health checks. Graceful drain.',
            verify: 'At N=4 workers, aggregate throughput ≥ 3.5× single worker on a mixed workload; failover when one worker is killed',
            hours: '6h',
          },
          {
            id: 'n-w9-b3',
            track: 'build',
            title: 'TP track — 2-GPU column-parallel MLP + row-parallel output',
            body:
              'On a small model (Llama-3.2-1B or your own toy 100M). Use torch.distributed with NCCL. Implement the column+row split for one MLP block. Sanity-check against single-GPU.',
            verify: 'Output matches single-GPU within 1e-3 rtol; per-token latency improves vs single-GPU on the same model',
            hours: '7h',
            resources: [R.megatron_tp, R.nccl_docs],
          },
          {
            id: 'n-w9-b4',
            track: 'build',
            title: 'Scaling chart',
            body:
              'Throughput vs replicas (or vs TP degree). Linear scaling is the asymptote you compare against. Annotate the gap and explain it (HBM, interconnect, kernel-launch overhead, scheduler contention).',
            verify: 'Chart in BENCHMARKS.md with annotated gap explanation',
            hours: '2h',
          },
          {
            id: 'n-w9-a1',
            track: 'apply',
            title: 'dist-inference README — the scaling story',
            body: 'Lead with the chart. Below it, two paragraphs: what scales, what does not, why.',
            verify: 'README pushed; chart embedded',
            hours: '1h',
          },
          {
            id: 'n-w9-a2',
            track: 'apply',
            title: 'Outreach round 3 — follow up + new DMs',
            body: 'Follow up the W4/W6 outreach (silent contacts get one nudge). Send 5 new DMs to dist-systems / inference leads at target companies.',
            verify: '5 follow-ups + 5 new DMs sent; replies tracked',
            hours: '1.5h',
          },
          {
            id: 'n-w9-p1',
            track: 'prep',
            title: 'System-design page 4 — "Design Distributed Batch Inference"',
            body: 'Constraints (1B docs, 1hr SLA, GPU pool with mixed sizes). Sharding + scheduling + spot-instance resilience.',
            verify: 'Page filled; rehearsed in 25 min',
            hours: '2.5h',
          },
          {
            id: 'n-w9-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums',
            verify: '4 mediums solved',
            hours: '2h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.pope_efficient, R.megatron_tp, R.weng_train_large, R.nccl_docs],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W10 — OSS Contribution
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-10',
    title: 'Phase 10 — OSS Contribution',
    blurb: 'Land one merged PR in a real serving project. Small + landed > big + stale.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'one merged PR in vLLM / SGLang / TGI / llama.cpp — or a PR with an active maintainer review',
    context:
      'A PR you can link in a cover letter is worth more than every line of mini-vllm. The realistic bar at W10 is "merged or under review" — not "merged in the first 48 hours." Pick a ticket with a clear scope; do not invent your own feature.',
    weeks: [
      {
        number: 10,
        title: 'Ship one OSS PR',
        goal:
          'One PR open in a serving repo with clean tests, clear description, maintainer-friendly diff. Doc / test / small-bug / small-feature scope. Goal: merged. Acceptable: in active review.',
        tasks: [
          {
            id: 'n-w10-r1',
            track: 'read',
            title: 'Re-read the W3 OSS scouting comment thread',
            body: 'You commented on a vLLM issue at W3. Maintainers may have replied. If the original ticket is dead, pick another from your shortlist.',
            verify: 'Decision in docs/oss-target.md: pursuing ticket X (URL), reason',
            hours: '45m',
          },
          {
            id: 'n-w10-r2',
            track: 'read',
            title: 'Repo CONTRIBUTING + dev setup',
            body: 'Read the contributor guide for your chosen repo. Set up dev environment, run tests locally, run their formatter/linter.',
            verify: 'Tests run green on main locally; pre-commit hooks installed',
            hours: '2h',
          },
          {
            id: 'n-w10-b1',
            track: 'build',
            title: 'Implement the change',
            body:
              'Keep diff small. Match existing style. Touch only what you must (read the project\'s CLAUDE.md / contributing if there is one — "surgical changes" matters here). One commit, well-named.',
            verify: 'Diff < 200 lines; only relevant files touched',
            hours: '6h',
          },
          {
            id: 'n-w10-b2',
            track: 'build',
            title: 'Test coverage — add or update a test',
            body: 'Any non-doc PR with no test gets ignored. Add the minimal test that proves your fix or covers your feature.',
            verify: 'New test included; runs green; fails on main without your change',
            hours: '2h',
          },
          {
            id: 'n-w10-b3',
            track: 'build',
            title: 'PR description — the writeup that gets reviewed',
            body:
              'Lead with the user-facing problem in 2 sentences. Then your fix in 2 sentences. Then how to verify. Reference the issue. Be polite about edge cases you skipped.',
            verify: 'PR open; description follows project template; CI green',
            hours: '1.5h',
          },
          {
            id: 'n-w10-a1',
            track: 'apply',
            title: 'Link the PR on LinkedIn + portfolio README',
            body: 'No marketing post. Just the link in your "Recent" section. Recruiters search for this; do not hide it.',
            verify: 'PR URL on LinkedIn featured section + portfolio meta-repo README',
            hours: '30m',
          },
          {
            id: 'n-w10-a2',
            track: 'apply',
            title: 'Applications — 10 more',
            body:
              'Half of total. Now mention "open PR in vLLM" (or whichever) in the cover. Even unmerged, the active-review status counts.',
            verify: '10 applications submitted; total now ≥ 25',
            hours: '3h',
          },
          {
            id: 'n-w10-p1',
            track: 'prep',
            title: 'System-design page 5 — "Design Embeddings Serving at Scale"',
            body: 'Constraints (1B vectors, 10k QPS, p99 < 30ms). Index choice (HNSW vs IVF). Sharding. Hot-key handling.',
            verify: 'Page filled; rehearsed in 25 min',
            hours: '2.5h',
          },
          {
            id: 'n-w10-p2',
            track: 'prep',
            title: 'Leetcode — 4 mediums + 1 hard',
            verify: '4 mediums + 1 hard solved',
            hours: '2.5h',
            resources: [R.neetcode],
          },
        ],
        reading: [R.vllm_repo, R.sglang_repo, R.tgi_repo, R.llamacpp_repo],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W11 — Interview Prep + Outreach Surge
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-11',
    title: 'Phase 11 — Interview Loops',
    blurb: 'Three mocks. Five system-design rehearsals. Outreach surge.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-compilers)',
    artifact: '3 mock interviews completed + 5 SD rehearsals + 20 outreach threads active',
    context:
      'The portfolio is mostly built. This week is mechanics: doing the loops, getting blunt feedback, fixing the gaps. The single highest-ROI activity is mock interviews — book them aggressively even if it feels uncomfortable.',
    weeks: [
      {
        number: 11,
        title: 'Loops in, feedback in',
        goal:
          'Three completed mock interviews (one ML systems, one DSA, one behavioral). All five SD pages presented out loud. Twenty active outreach threads.',
        tasks: [
          {
            id: 'n-w11-r1',
            track: 'read',
            title: 'Huyen — ML Interviews chapter on ML systems',
            body: 'The decision-tree for SD questions in ML/AI roles. Skim, internalize the framing.',
            verify: 'Notes: the five SD components Huyen always asks about (data, model, infra, eval, monitoring)',
            hours: '2h',
            resources: [R.huyen_ml_interview],
          },
          {
            id: 'n-w11-r2',
            track: 'read',
            title: 'Public writeups — Anthropic / Together / OpenAI inference interview accounts',
            body: 'Levels.fyi, Glassdoor, Reddit r/MachineLearning interview threads. Note common questions.',
            verify: 'docs/interview-questions.md with 10 likely questions per target company tier',
            hours: '2h',
          },
          {
            id: 'n-w11-b1',
            track: 'build',
            title: 'Mock 1 — ML systems (the booked W8 slot)',
            body: 'Lead with one of your SD pages. Take notes during. Right after, write a postmortem.',
            verify: 'Mock completed; docs/mock-1.md postmortem committed within 24h',
            hours: '2h',
          },
          {
            id: 'n-w11-b2',
            track: 'build',
            title: 'Mock 2 — DSA (Pramp or interviewing.io)',
            body: 'One medium + one hard. 60 min total. Get feedback on communication, not just correctness.',
            verify: 'Mock completed; postmortem committed',
            hours: '2h',
          },
          {
            id: 'n-w11-b3',
            track: 'build',
            title: 'Mock 3 — behavioral with a peer',
            body: 'Six STAR stories (from W5). Have the peer interrupt with follow-ups. Time each story (< 90s).',
            verify: 'Mock completed; postmortem committed',
            hours: '1.5h',
          },
          {
            id: 'n-w11-a1',
            track: 'apply',
            title: 'Outreach surge — push to 20 active threads',
            body:
              'You should already have 15+ from W4/W6/W9. Add 5 more, then follow up everyone who has not replied. Recruiter cold-outreach: also acceptable now that portfolio is dense.',
            verify: 'docs/outreach.md shows 20 active threads (sent ≤ 14 days ago)',
            hours: '3h',
          },
          {
            id: 'n-w11-a2',
            track: 'apply',
            title: 'Applications — 10 more (total ≥ 35)',
            body: 'Hit your hiring funnel hard. Application math is brutal — assume 2-5% response rate, 25% of replies → screen, 25% of screens → onsite.',
            verify: '10 applications submitted; cumulative ≥ 35',
            hours: '3h',
          },
          {
            id: 'n-w11-p1',
            track: 'prep',
            title: 'Rehearse all 5 SD pages out loud, on camera',
            body:
              'One pass each. Watch the videos at 1.5×. You will hate watching yourself; do it anyway. The crutch words ("um", "kind of", "basically") are what to fix.',
            verify: 'Five videos recorded; one-line self-critique per page committed',
            hours: '3h',
          },
          {
            id: 'n-w11-p2',
            track: 'prep',
            title: 'Compensation prep',
            body:
              'Pull levels.fyi data for target tiers. Write your floor + target + ceiling numbers down. Practice saying the target number out loud — without softening it.',
            verify: 'docs/comp.md with three numbers per tier; practice rehearsal logged',
            hours: '1.5h',
          },
        ],
        reading: [R.huyen_ml_interview, R.donne_martin, R.neetcode],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // W12 — Land + Polish
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'n-phase-12',
    title: 'Phase 12 — Land',
    blurb: 'Portfolio hub, convert onsites, negotiate. The sprint ends with offers in motion.',
    year: 0,
    cadence: 'week',
    color: 'var(--m-track-foundations)',
    artifact: 'portfolio.<your-domain>.dev hub linking all 4 projects + OSS PR + writeups',
    context:
      'Whether you have offers in hand by Friday or not, the artifact is durable: a single page that shows what you built in 90 days. If you have offers, this week converts the strongest into a signed letter. If you do not, you continue applying — but from a portfolio that 95% of LLM-infra applicants do not have.',
    weeks: [
      {
        number: 12,
        title: 'Portfolio hub + conversion',
        goal:
          'One portfolio hub page live (static site or single GitHub README). All onsites in motion converted. Open offers compared against your W11 comp targets. Sprint retrospective written.',
        tasks: [
          {
            id: 'n-w12-r1',
            track: 'read',
            title: 'Re-read all four project READMEs as a stranger would',
            body: 'Mark anything that requires insider context. Fix the worst three.',
            verify: 'Three concrete README fixes committed across the four projects',
            hours: '2h',
          },
          {
            id: 'n-w12-b1',
            track: 'build',
            title: 'portfolio hub page',
            body:
              'A single page (Astro, Next, plain HTML — does not matter). Top: one-paragraph narrative ("Senior SWE who spent 90 days rebuilding the LLM-serving stack from first principles"). Below: four project cards with one number each (the headline metric). Below that: PR link, writeups, contact.',
            verify: 'Page deployed at a stable URL; mobile-readable; links work',
            hours: '4h',
          },
          {
            id: 'n-w12-b2',
            track: 'build',
            title: 'Resume v2 — projects-led, not roles-led',
            body:
              'Top section: the four projects with metrics. Then OSS PR. Then prior SWE roles (compressed to 5 lines each). Half a page max for pre-AI experience.',
            verify: 'Resume PDF committed; two reviewers gave blunt feedback',
            hours: '3h',
          },
          {
            id: 'n-w12-a1',
            track: 'apply',
            title: 'Convert active onsites',
            body:
              'Any onsite this week: lead with mini-vllm SD walkthrough. Use the W11 SD pages. Take notes from each loop; share thank-you within 24h.',
            verify: 'All scheduled onsites attended; thank-yous sent within 24h',
            hours: '8h',
          },
          {
            id: 'n-w12-a2',
            track: 'apply',
            title: 'Final 10 applications',
            body: 'Total cumulative ≥ 45. Sprint ends with the funnel still full so that month 4 conversion is not from cold start.',
            verify: '10 applications submitted',
            hours: '3h',
          },
          {
            id: 'n-w12-a3',
            track: 'apply',
            title: 'Offer comparison + negotiation',
            body:
              'Any offer that lands this week: do not accept on the spot. Sit on it 48h, run the negotiation playbook (counter on comp, not benefits, anchor with target competing offer if you have one).',
            verify: 'docs/offers.md with each offer + the counter you sent + final number',
            hours: 'as needed',
          },
          {
            id: 'n-w12-p1',
            track: 'prep',
            title: 'Sprint retrospective',
            body:
              'What landed (numbers). What did not. What you would do differently if you re-ran W0 with this hindsight. This is the artifact you re-read every six months for the rest of your career.',
            verify: 'docs/retro.md committed; honest, specific, no fluff',
            hours: '2h',
          },
          {
            id: 'n-w12-p2',
            track: 'prep',
            title: 'Next-90-day plan',
            body:
              'You either have an offer (now month 1 of new role: 90-day plan for ramping). Or you do not (now month 4 of search: which assumptions failed, what changes). Either way: a written plan beats default-mode coasting.',
            verify: 'docs/next-90.md committed',
            hours: '1.5h',
          },
        ],
        reading: [R.weng_inference, R.pope_efficient, R.mosaic_applied],
      },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────
// Helpers — local, close over North's PATH (not Atlas's).
// ────────────────────────────────────────────────────────────────────────

export function allTasks(): Task[] {
  return PATH.flatMap((p) => p.weeks.flatMap((w) => w.tasks))
}

export function getWeek(num: number): { phase: Phase; week: Week } | null {
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      if (week.number === num) return { phase, week }
    }
  }
  return null
}

export function totalTasks(): number {
  return allTasks().length
}

export function maxWeek(): number {
  return Math.max(...PATH.flatMap((p) => p.weeks.map((w) => w.number)))
}

export function periodLabel(phase: Phase, week: Week): string {
  if (phase.cadence === 'week') return `W${week.number}`
  const idx = phase.weeks.findIndex((w) => w.number === week.number)
  return `Y${phase.year}·Q${idx + 1}`
}

export function periodLabelByNumber(num: number): string {
  const ctx = getWeek(num)
  if (!ctx) return `W${num}`
  return periodLabel(ctx.phase, ctx.week)
}

export type YearGroup = { year: 0 | 1 | 2 | 3; cadence: 'week' | 'quarter'; weeks: { phase: Phase; week: Week }[] }

export function groupedByYear(): YearGroup[] {
  const map = new Map<number, YearGroup>()
  for (const phase of PATH) {
    let g = map.get(phase.year)
    if (!g) {
      g = { year: phase.year, cadence: phase.cadence, weeks: [] }
      map.set(phase.year, g)
    }
    for (const week of phase.weeks) g.weeks.push({ phase, week })
  }
  return Array.from(map.values()).sort((a, b) => a.year - b.year)
}

// ────────────────────────────────────────────────────────────────────────
// Span helpers — global-week index maps onto period numbers 1:1 in North,
// since every phase is single-week cadence. Implemented identically to
// Atlas so the timeline component can stay symmetric.
// ────────────────────────────────────────────────────────────────────────

let _spanMap: Map<number, [number, number]> | null = null

function buildSpanMap(): Map<number, [number, number]> {
  if (_spanMap) return _spanMap
  const m = new Map<number, [number, number]>()
  let cursor = 0
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      const span = phase.cadence === 'week' ? 1 : 13
      m.set(week.number, [cursor, cursor + span - 1])
      cursor += span
    }
  }
  _spanMap = m
  return m
}

export function periodSpan(periodNumber: number): [number, number] {
  return buildSpanMap().get(periodNumber) ?? [0, 0]
}

export function maxGlobalWeek(): number {
  let last = 0
  buildSpanMap().forEach(([, end]) => {
    if (end > last) last = end
  })
  return last
}

export function totalGlobalWeeks(): number {
  return maxGlobalWeek() + 1
}

export function periodAtGlobalWeek(g: number): { phase: Phase; week: Week } | null {
  const spans = buildSpanMap()
  for (const phase of PATH) {
    for (const week of phase.weeks) {
      const span = spans.get(week.number)
      if (span && g >= span[0] && g <= span[1]) return { phase, week }
    }
  }
  return null
}

export function periodIndexInPhase(phase: Phase, week: Week): number {
  return phase.weeks.findIndex((w) => w.number === week.number)
}

// ────────────────────────────────────────────────────────────────────────
// Resource library re-export — for external code that wants the catalog.
// ────────────────────────────────────────────────────────────────────────

export const NORTH_RESOURCES: Record<string, Resource> = R
