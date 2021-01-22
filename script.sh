#!/bin/bash

#/dev/sda1 - /boot
#/dev/sda2 - / 
#/dev/sda3 - swap
#/dev/sda4 - /home


# Ставим быстрые репы

> /etc/pacman.d/mirrorlist
cat <<EOF >>/etc/pacman.d/mirrorlist

##
## Arch Linux repository mirrorlist
## Generated on 2020-01-02
##

## Russia
#Server = http://mirror.rol.ru/archlinux/\$repo/os/\$arch
Server = https://mirror.rol.ru/archlinux/\$repo/os/\$arch
#Server = http://mirror.truenetwork.ru/archlinux/\$repo/os/\$arch
#Server = http://mirror.yandex.ru/archlinux/\$repo/os/\$arch
Server = https://mirror.yandex.ru/archlinux/\$repo/os/\$arch
#Server = http://archlinux.zepto.cloud/\$repo/os/\$arch

EOF

# Активируем новые репы
pacman-key --init
pacman-key --populate archlinux
pacman -Sy


#Форматируем в ext 4 наш диск

mkfs.ext4 /dev/sda1


# Монтируем диск к папке
mount /dev/sda1 /mnt



#Устанавливаем based  и linux ядро + софт который нам нужен сразу
pacstrap /mnt base base-devel linux linux-headers vim bash-completion grub # parted

# прописываем fstab
genfstab -pU /mnt >> /mnt/etc/fstab

#Прокидываем правильные быстрые репы внутрь
cp /etc/pacman.d/mirrorlist /mnt/etc/pacman.d/mirrorlist


# Делаем скрипт пост инстала:
cat <<EOF  >> /mnt/opt/install.sh
#!/bin/bash



echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
echo "ru_RU.UTF-8 UTF-8" >> /etc/locale.gen 
echo 'Обновим текущую локаль системы'
locale-gen

sleep 1
ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime
echo "/dev/sda /    ext4 defaults 0 1" > /etc/fstab
grub-install /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
pacman-key --init
pacman-key --populate archlinux
pacman  -Sy  xorg xorg-server  lightdm-deepin-greeter  
pacman  -Sy  deepin deepin-extra


grep -r -l '#greeter-session=example-gtk-gnome' /etc/lightdm/lightdm.conf | xargs sed -i 's/\#greeter-session\=example-gtk-gnome/greeter-session\=lightdm-deepin-greeter/g'
#stemctl start lightdm.service
systemctl enable lightdm.service
sleep 1
echo "password for root user:"
passwd
echo "add new user"
useradd -m -g users -s /bin/bash svetozar
echo "paaswd for new user"
passwd svetozar



exit


EOF

arch-chroot /mnt /bin/bash  /opt/install.sh

reboot