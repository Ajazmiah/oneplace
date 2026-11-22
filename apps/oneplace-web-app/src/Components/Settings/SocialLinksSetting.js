"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/Components/ui/input";
import {
  Github,
  Linkedin,
  Globe,
  Twitter,
  Trash2,
  Pencil,
  Link as LinkIcon,
} from "lucide-react";
import AlertDialogBox from "@/Components/AlertDialog/AlertDialog";
import { getSocialLinks, saveSocialLinks } from "@/app/lib/DataAccessLayer/socialLinks";

const initialSocialFields = [
  {
    name: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "twitter",
    label: "X / Twitter",
    icon: Twitter,
    placeholder: "https://x.com/username",
  },
  {
    name: "website",
    label: "Website",
    icon: Globe,
    placeholder: "https://yourdomain.com",
  },
];

export default function SocialLinksSetting() {
  const [socialFields, setSocialFields] = useState(initialSocialFields);

  const [confirmDeleteLink, setConfirmDeleteLink] = useState(false)
  const [linkPendingDelete, setLinkPendingDelete] = useState(null)
  const [moreLinkName, setMoreLinkName] = useState('')
  const [open, setOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState(
    socialFields.map(({ name }) => ({ socialLabel: name, url: "" }))
  );
  const [editingFields, setEditingFields] = useState(new Set());
  const [draftValues, setDraftValues] = useState({});

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const links = await getSocialLinks();
      if (!links || links.length === 0) return;

      setSocialFields((prevFields) => {
        const existingNames = new Set(prevFields.map((field) => field.name));
        const extraFields = links
          .filter((link) => !existingNames.has(link.socialLabel))
          .map((link) => ({
            name: link.socialLabel,
            label: link.socialLabel,
            icon: LinkIcon,
            placeholder: "enter URL",
          }));
        return [...prevFields, ...extraFields];
      });

      setSocialLinks((prevLinks) => {
        const merged = [...prevLinks];
        links.forEach((link) => {
          const index = merged.findIndex(
            (existing) => existing.socialLabel === link.socialLabel
          );
          if (index !== -1) {
            merged[index] = link;
          } else {
            merged.push(link);
          }
        });
        return merged;
      });
    };

    fetchSocialLinks();
  }, []);

  const handleDraftChange = (name, value) => {
    setDraftValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditField = (name) => {
    setEditingFields((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleSave = async () => {
    // What's typed lives in draftValues until saved, so apply it on top of the saved links.
    // The server replaces the whole list, so links left out (deleted or blank) are removed.
    const links = socialFields
      .map(({ name }) => {
        const saved = socialLinks.find((link) => link.socialLabel === name)?.url ?? "";
        return { socialLabel: name, url: (draftValues[name] ?? saved).trim() };
      })
      .filter((link) => link.url !== "");

    const res = await saveSocialLinks(links);

    if (res.success) {
      setSocialLinks(links);
      setDraftValues({});
      setEditingFields(new Set());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteLink = (name) => {
    setLinkPendingDelete(name);
    setConfirmDeleteLink(true);
  };

  const confirmDeleteLinkAction = () => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.socialLabel === linkPendingDelete ? { ...link, url: "" } : link
      )
    );
    setEditingFields((prev) => {
      const next = new Set(prev);
      next.delete(linkPendingDelete);
      return next;
    });
    setDraftValues((prev) => {
      const next = { ...prev };
      delete next[linkPendingDelete];
      return next;
    });
    setConfirmDeleteLink(false);
    setLinkPendingDelete(null);
  };

  const cancelDeleteLink = () => {
    setConfirmDeleteLink(false);
    setLinkPendingDelete(null);
  };

  const handleAddMoreLink = () => {
    setSocialFields((prev) => [
      ...prev,
      { name:moreLinkName, label: moreLinkName, icon: LinkIcon, placeholder: "enter URL" },
    ]);
    setSocialLinks((prev) => [...prev, { socialLabel: moreLinkName, url: "" }]);
    setOpen(false)
    setMoreLinkName('')
  };

  return (
    <div>
      <AlertDialogBox
        open={open}
        onCancel={() => {
          setOpen(false)
          setMoreLinkName('')
        }}
        onConfirm={handleAddMoreLink}
        title="Add name for the link"
      >
        <Input
          placeholder="URL..."
          value={moreLinkName}
          onChange={(e) => setMoreLinkName(e.target.value)}
        />
      </AlertDialogBox>
      <AlertDialogBox
        open={confirmDeleteLink}
        onCancel={cancelDeleteLink}
        onConfirm={confirmDeleteLinkAction}
        title="Are you sure you want to delete this link?"
        description="This action cannot be undone. You'll need to re-add the link if you change your mind."
      />
      {/* Social media card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
          Social profiles
        </p>
        <div className="grid grid-cols-1 gap-4">
          {socialFields.map(({ name, label, icon: Icon, placeholder }) => {
            const savedValue = socialLinks.find((link) => link.socialLabel === name)?.url ?? ""
            const isEditing = editingFields.has(name) || savedValue === "";
            const draftValue = draftValues[name] ?? savedValue;
            return (
              <div key={name} className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <Icon className="h-3.5 w-3.5 text-gray-400" />
                  {label}
                </label>
                {!isEditing ? (
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2">
                    <p className="flex-1 truncate rounded-md bg-brand/10 px-2 py-1 text-sm text-gray-700">
                      {savedValue}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleEditField(name)}
                      aria-label={`Edit ${label}`}
                      className="text-gray-500 hover:text-brand-strong transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(name)}
                      aria-label={`Delete ${label}`}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Input
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => handleDraftChange(name, e.target.value)}
                    className="focus-visible:ring-[#0bbcaa]/40 focus-visible:border-[#0bbcaa]"
                    value={draftValue}
                  />
                )}
              </div>
            )
          })}

          <div
            onClick={() => setOpen(true)}
            className="mt-3 flex w-full items-center justify-center py-2.5 rounded-xl text-xs font-medium border border-dashed border-gray-200 text-gray-500 hover:border-[#0bbcaa] hover:text-brand-strong hover:bg-[#0bbcaa]/5 transition-all duration-200"
          >
            + Add another link
          </div>
        </div>

        <div className="flex items-center justify-end pt-6">
          <button
            onClick={handleSave}
            type="button"
            className="rounded-lg bg-brand-strong px-6 py-3 text-sm font-semibold text-white hover:bg-brand-strong-hover transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
