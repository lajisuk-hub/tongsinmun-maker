export async function POST(req) {
  try {
    const { text, context } = await req.json();

    if (!text || !text.trim()) {
      return Response.json({ error: '다듬을 내용을 먼저 적어주세요.' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'AI 비밀키가 설정되지 않았습니다. 관리자에게 문의해주세요.' },
        { status: 500 }
      );
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 300,
        system:
          '너는 어린이집 가정통신문 문구를 다듬는 도우미다. 학부모님께 보내기 좋은 따뜻하고 정중한 존댓말 문장으로 자연스럽게 다듬어라. 원래 의미와 사실을 그대로 유지하고, 없는 내용을 지어내지 마라. 결과는 2~3개의 문장을 줄바꿈 없이 자연스럽게 이어 붙인 하나의 문단으로만 써라. 문장마다 줄을 바꾸지 마라. 전체 길이는 공백 포함 80자를 넘기지 마라. 큰따옴표(")는 절대 사용하지 마라. 다듬은 문단만 출력하고 앞뒤에 다른 설명을 붙이지 마라.',
        messages: [
          {
            role: 'user',
            content: `다음은 가정통신문의 [${context || '안내'}] 부분에 들어갈 초안입니다. 짧은 2~3개 문장이 자연스럽게 이어진 한 문단(공백 포함 80자 이내)으로 다듬어 주세요. 줄바꿈은 넣지 마세요.\n\n${text}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return Response.json({ error: 'AI 호출에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
    }

    const data = await res.json();
    let result = (Array.isArray(data.content) ? data.content : [])
      .filter((b) => b && b.type === 'text' && b.text)
      .map((b) => b.text)
      .join(' ')
      .trim();
    // 혹시 줄바꿈이 섞여 와도 한 문단으로 이어 붙인다
    result = result.split('\n').map((l) => l.trim()).filter(Boolean).join(' ');

    if (!result) {
      return Response.json({ error: 'AI 응답이 비어 있습니다. 다시 시도해주세요.' }, { status: 502 });
    }

    return Response.json({ result });
  } catch (e) {
    return Response.json({ error: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
