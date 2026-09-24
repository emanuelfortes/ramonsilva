// Dados compartilhados por todas as páginas do site (hub, curso, vaga, evento).
// Edite aqui o telefone, as redes e a cidade — vale para o site inteiro.

export const contato = {
  whatsapp: "5585988905202", // DDI + DDD + número, só dígitos — (85) 98890-5202
  whatsappMensagem:
    "Olá, Ramon! Quero saber mais sobre o Curso de Barbeiro Iniciante.",
  instagram: "https://instagram.com/ramonsilvabarbearia",
  cidade: "Fortaleza - CE",
};

/** Monta o link do WhatsApp já com a mensagem pronta para o assunto certo. */
export function montarWhatsapp(mensagem: string) {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const whatsappLink = montarWhatsapp(contato.whatsappMensagem);

/** Domínio final do site. Troque aqui (ou via NEXT_PUBLIC_SITE_URL no deploy)
 *  para os links de compartilhamento e o SEO apontarem para o endereço certo. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ramonsilvabarbeiro.com.br";
